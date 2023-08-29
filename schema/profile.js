import { gql } from "graphql-tag"

export default gql`
scalar Upload
type Profile {
    id: ID!
    filename: String!
    user: User
  }
  extend type Query {
    profiles: [Profile]
    profile(id: ID!): Profile
  }
  extend type Mutation {
    createProfile(file: Upload!): Profile!
    deleteProfile(id: ID!): String!
    updateProfile(file: Upload!, id: ID!): Profile
  }
`;
