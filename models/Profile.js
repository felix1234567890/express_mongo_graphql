import { Schema, model } from "mongoose"

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
export const Profile = model("Profile", profileSchema);
