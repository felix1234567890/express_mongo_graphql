const { Schema, model } = require("mongoose");
const timezone = require("mongoose-timezone");

const timeSheetSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
timeSheetSchema.plugin(timezone);
const Timesheet = model("Timesheet", timeSheetSchema);
module.exports = Timesheet;
