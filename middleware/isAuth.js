import jwt from "jsonwebtoken"
import {  GraphQLError } from "graphql"
const secret = process.env.SECRET_KEY;

export default (request) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      throw new GraphQLError("Token must be in format Bearer 27042t84202....");
    }
    try {
      const user = jwt.verify(token, secret);
      return user;
    } catch (error) {
      throw new GraphQLError("Token is invalid");
    }
  }
  throw new GraphQLError("No authentication in  header", 500);
};
