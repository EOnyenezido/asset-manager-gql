import { DataSource } from 'apollo-datasource';
import isEmail from 'isemail';

class UserAPI extends DataSource {
  constructor(store) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findUser({ emailAddress }) {
    if (!emailAddress || !isEmail.validate(emailAddress)) return null;
    const user = await this.store.findOne({ where: { emailAddress: emailAddress } });
    return user ? user : null;
  }

  async createNewUser(details) {
    const user = await this.store.create(details, {
      fields: ['emailAddress', 'password', 'firstName', 'lastName', 'phoneNumber']
    })

    return user ? user : null;
  }
}

export default UserAPI;