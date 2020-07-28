const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const moment = require("moment");

module.exports = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return moment(value).format("DD.MM.YYYY");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value.toString();
      }
      return null;
    },
  }),
  Time: new GraphQLScalarType({
    name: "Time",
    description: "Time custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return moment(value).format("HH:mm");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value.toString();
      }
      return null;
    },
  }),
};
