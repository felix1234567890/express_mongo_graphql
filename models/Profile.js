const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = model("Profile", profileSchema);
