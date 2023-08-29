import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import scalars from './schema/scalars.js'
import userSchema from './schema/user.js'
import timesheetSchema from './schema/timesheet.js'
import profileSchema from './schema/profile.js'
import resolvers from './resolvers/index.js'
import http from 'http'
import {
  ApolloServerPluginDrainHttpServer
} from '@apollo/server/plugin/drainHttpServer'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'

const port = process.env.PORT || 4000
const uri = process.env.MONGO_URI

mongoose.connect(uri)
const app = express()
const httpServer = http.createServer(app)
let server
app.use(cors())
app.use(express.json())
app.use(graphqlUploadExpress())
const startServer = async () => {
  server = new ApolloServer({
    typeDefs: [scalars, userSchema, timesheetSchema, profileSchema],
    resolvers,
    playground: true,
    context: ({ req }) => ({ req }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })
  await server.start()
}

startServer().then(async (_) => {
  app.use(
    '/graphql',
    expressMiddleware(server)
  )
  await new Promise((resolve) => httpServer.listen({ port }, resolve()))
  console.log('🚀 Server ready at http://localhost:4000/graphql')
})
