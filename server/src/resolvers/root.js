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
        const token = jwt.sign(user.dataValues, process.env.SECRET, {
          expiresIn: process.env.EXPIRATION,
        })
        user.token = token;
      }
      return user;
    },
    register: async (_, details, { dataSources }) => {
      const hashedPassword = await bcrypt.hash(details.password, 10);
      const user = await dataSources.userAPI.createNewUser({...details, password: hashedPassword});
      if (user) {
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