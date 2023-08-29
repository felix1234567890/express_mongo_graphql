import userResolvers from "./userResolvers.js"
import scalarResolvers from "./scalarResolvers.js"
import timeSheetResolvers from "./timesheetResolvers.js"
import profileResolvers from "./profileResolvers.js"

export default {
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
