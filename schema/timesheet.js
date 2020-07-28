const { gql } = require("apollo-server-express");

module.exports = gql`
  type Timesheet {
    id: ID!
    date: Date!
    startTime: Time!
    endTime: Time!
    user: User!
  }
  input TimesheetInput {
    date: Date!
    startTime: Time!
    endTime: Time!
  }
  input UpdateTimesheet {
    id: ID!
    date: Date
    startTime: Time
    endTime: Time
  }
  extend type Query {
    timesheets(limit: Int): [Timesheet]
    timesheet(id: ID!): Timesheet
    timesheetCount: Int
  }
  extend type Mutation {
    createTimesheet(createTimesheetInput: TimesheetInput): Timesheet!
    deleteTimesheet(id: String!): String!
    updateTimesheet(updateTimesheetInput: UpdateTimesheet): Timesheet!
  }
`;
