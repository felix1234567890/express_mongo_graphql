import { gql } from 'graphql-tag'

export default gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profile: Profile
    timesheets: [Timesheet]
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UpdateUser {
    firstName: String
    lastName: String
    email: String
    password: String
  }
  type Query {
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(createUserInput: UserInput): String!
    login(email: String!, password: String!): String!
    updateUser(updateUserInput: UpdateUser): User!
    deleteUser(id: String!): User
  }
`
