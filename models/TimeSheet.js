import { Schema, model } from 'mongoose'

const timeSheetSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})
export const Timesheet = model('Timesheet', timeSheetSchema)
