const Mutation = `
  type Mutation {
    login(emailAddress: String!, password: String!): User
    register(emailAddress: String!, password: String!, firstName: String!, lastName: String!, phoneNumber: String!): User
  }
`;

export default Mutation;