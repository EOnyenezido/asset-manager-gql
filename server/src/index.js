import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema/schema';
import User from './models/User';
import UserApi from './datasources/user-api';
import resolvers from './resolvers/root';
import LoggingExtension from './extensions/logging';
import * as jwt from 'jsonwebtoken';

require('dotenv').config();

const dataSources = () => ({
  userAPI: new UserApi( User ),
});

const server = new ApolloServer({
  context: ({ req }) => {
    const token = req.params['token'] || req.headers['x-access-token'];
    let user;
    if (token) {
      user = jwt.verify(token, process.env.SECRET, (err, user) => {
        // Wrong token
        if (err)	{
          return null;
        }
        else	{
          // If everything is good add user to context
          return user;
        }
      });
    } else  {
      //--•
      // Otherwise, this request did not come from a logged-in user.
      return null;
    }
    return {
      user
    }
  },
  typeDefs,
  resolvers,
  dataSources,
  extensions: [() => new LoggingExtension()],
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  // TODO: Replace with Winston
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);