const jwt = require("jsonwebtoken");
const { ApolloError, AuthenticationError } = require("apollo-server-express");
const secret = process.env.SECRET_KEY;
module.exports = (request) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      throw new ApolloError("Token must be in format Bearer 27042t84202....");
    }
    try {
      const user = jwt.verify(token, secret);
      return user;
    } catch (error) {
      throw new AuthenticationError("Token is invalid");
    }
  }
  throw new ApolloError("No authentication in  header", 500);
};
