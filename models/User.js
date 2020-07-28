const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "First name should have at least 2 characters"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Last name should have at least 2 characters"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Email is required"],
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
  },
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
  timesheets: [{ type: Schema.Types.ObjectId, ref: "Timesheet" }],
});
const User = model("User", userSchema);
module.exports = User;
