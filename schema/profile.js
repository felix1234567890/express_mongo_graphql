const { gql } = require("apollo-server-express");

module.exports = gql`
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
