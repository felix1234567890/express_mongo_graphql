import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import isAuth from "../middleware/isAuth.js";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

const secret = process.env.SECRET_KEY;

const generateToken = (id, expiresIn) => {
  const token = jwt.sign({ id }, secret, { expiresIn });
  return token;
};
const hashPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(pass, salt);
  return password;
};
export default {
  Query: {
    users: async () => {
      const users = await User.find()
        .populate("timesheets")
        .populate("profile");
      return users;
    },
    user: async (_, { id }) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new GraphQLError("Invalid id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      return await User.findById(id).populate("timesheets");
    },
  },
  Mutation: {
    deleteUser: async (_, { id }, { req }) => {
      const res = isAuth(req);
      if (id !== res.id) {
        throw new GraphQLError("Cannot delete another user", 500);
      }
      return await User.findByIdAndRemove(id);
    },
    createUser: async (
      _,
      { createUserInput: { firstName, lastName, email, password } }
    ) => {
      const usr = await User.findOne({ email });
      if (usr) {
        throw new GraphQLError("Email is already taken", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      password = await hashPassword(password);
      const user = new User({ firstName, lastName, email, password });
      const res = await user.save();
      return generateToken(res.id, "1h");
    },
    updateUser: async (
      _,
      { updateUserInput: { firstName, lastName, email, password } },
      { req }
    ) => {
      const res = isAuth(req);
      const user = await User.findById(res.id);
      if (!user) throw new GraphQLError("User doesn'\t exist");
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (password) {
        user.password = await hashPassword(password);
      }
      return await user.save();
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("User with this email doesn't exist");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new GraphQLError("Wrong credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return generateToken(user.id, "1h");
    },
  },
};
