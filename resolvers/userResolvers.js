const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuth = require("../middleware/isAuth");
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server-express");

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
module.exports = {
  Query: {
    users: async () => {
      const users = await User.find()
        .populate("timesheets")
        .populate("profile");
      return users;
    },
    user: async (_, { id }) => {
      return await User.findById(id).populate("timesheets");
    },
  },
  Mutation: {
    deleteUser: async (_, { id }, { req }) => {
      const res = isAuth(req);
      if (id !== res.id) {
        throw new ApolloError("Cannot delete another user", 500);
      }
      return await User.findByIdAndRemove(id);
    },
    createUser: async (
      _,
      { createUserInput: { firstName, lastName, email, password } }
    ) => {
      const usr = await User.findOne({ email });
      if (usr) {
        throw new UserInputError("Email is already taken", {
          errors: {
            email: "Email has been taken",
          },
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
      if (!user) throw new Error("User doesn'\t exist");
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
        throw new AuthenticationError("User with this email doesn't exist");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new AuthenticationError("Wrong credentials");
      }
      return generateToken(user.id, "1h");
    },
  },
};
