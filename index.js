const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const scalars = require("./schema/scalars");
const userSchema = require("./schema/user");
const timesheetSchema = require("./schema/timesheet");
const profileSchema = require("./schema/profile");
const resolvers = require("./resolvers");

const app = express();
const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const server = new ApolloServer({
  typeDefs: [scalars, userSchema, timesheetSchema, profileSchema],
  resolvers,
  context: ({ req }) => ({ req }),
});

server.applyMiddleware({ app });

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
