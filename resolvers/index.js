const userResolvers = require("./userResolvers");
const scalarResolvers = require("./scalarResolvers");
const timeSheetResolvers = require("./timesheetResolvers");
const profileResolvers = require("./profileResolvers");

module.exports = {
  ...scalarResolvers,
  Query: {
    ...userResolvers.Query,
    ...timeSheetResolvers.Query,
    ...profileResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...timeSheetResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
};
