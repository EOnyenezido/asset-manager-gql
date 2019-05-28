import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const root = {
  Query: {
    me: async (_, {__}, { user }) => {
      if (!user) {
        throw new Error('Not Authenticated')
      }
      return user;
    }
  },
  Mutation: {
    login: async (_, { emailAddress, password }, { dataSources }) => {
      const user = await dataSources.userAPI.findUser({ emailAddress });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) { // passwords match, create token
          const token = jwt.sign(user.dataValues, process.env.SECRET, {
            expiresIn: process.env.EXPIRATION,
          })
          user.token = token;
          return user;
        } else {
          return null; // passwords don't match
        }        
      }
      return null; // user does not exist
    },
    register: async (_, details, { dataSources }) => {
      const hashedPassword = await bcrypt.hash(details.password, 10);
      const user = await dataSources.userAPI.createNewUser({...details, password: hashedPassword});
      if (user && user.dataValues) {
        delete user.dataValues.password; // remove password here is necessary because create returns the full object while find follows the defined scope in the model that excludes sensitive fields
        const token = jwt.sign(user.dataValues, process.env.SECRET, {
          expiresIn: process.env.EXPIRATION,
        })
        user.token = token;
      }
      return user;
    },
  }
};

export default root;