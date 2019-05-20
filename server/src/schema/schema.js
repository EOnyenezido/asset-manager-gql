import { gql } from 'apollo-server-express';
import Query from './controllers/Query';
import Mutation from './controllers/Mutation';
import UserType from './types/user-type';

const typeDefs = gql`
${Query}
${Mutation}
${UserType}
`;

export default typeDefs;