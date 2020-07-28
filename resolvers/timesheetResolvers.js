const Timesheet = require("../models/TimeSheet");
const User = require("../models/User");
const isAuth = require("../isAuth");
const { ApolloError } = require("apollo-server-express");

module.exports = {
  Query: {
    timesheets: async (_, { limit }) => {
      let timesheets;
      if (limit) {
        timesheets = await Timesheet.find()
          .limit(limit)
          .populate({ path: "user" });
      } else {
        timesheets = await Timesheet.find().populate({ path: "user" });
      }
      return timesheets;
    },
    timesheet: async (_, { id }) => {
      return await Timesheet.findById(id).populate("user");
    },
    timesheetCount: async () => {
      return await Timesheet.find().countDocuments();
    },
  },
  Mutation: {
    createTimesheet: async (
      _,
      { createTimesheetInput: { date, startTime, endTime } },
      { req }
    ) => {
      const res = isAuth(req);
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      if (start > end) {
        throw new ApolloError("End time should come after start time", 500);
      }
      const timesheet = new Timesheet();
      timesheet.date = date;
      timesheet.startTime = startTime;
      timesheet.endTime = endTime;
      const user = await User.findById(res.id);
      timesheet.user = user;
      await timesheet.save();
      user.timesheets = user.timesheets.concat(timesheet._id);
      await user.save();
      return timesheet;
    },
    updateTimesheet: async (
      _,
      { updateTimesheetInput: { id, date, startTime, endTime } },
      { req }
    ) => {
      const timesheet = await Timesheet.findById(id);
      if (!timesheet) throw new ApolloError("Timesheet not found", 404);
      const res = isAuth(req);
      if (timesheet.user != res.id) {
        throw new ApolloError(
          "You cannot update someone else's timesheet",
          405
        );
      }
      if (date) timesheet.date = date;
      if (startTime) timesheet.startTime = startTime;
      if (endTime) timesheet.endTime = endTime;
      await timesheet.save();
      return timesheet;
    },
    deleteTimesheet: async (_, { id }, { req }) => {
      const res = isAuth(req);
      const timesheet = await Timesheet.findById(id);
      if (!timesheet) throw new ApolloError("Timesheet not found", 404);
      if (timesheet.user != res.id) {
        throw new ApolloError("You cannot delete other's timesheet", 405);
      }
      await Timesheet.findByIdAndRemove(id);
      return "Timesheet successfully deleted";
    },
  },
};
