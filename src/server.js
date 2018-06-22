const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()

const {
  DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
} = process.env
mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean
})

const db = mongoose.connection

db.on('error', console.error)

db.once('open', () => {
  console.log('✔️  Connected to MongoDB')

  const typeDefs = gql`
    type Query {
      todos: [Todo!]!
    }

    type Mutation {
      createTodo(text: String!): Todo!
      updateTodo(id: ID!, complete: Boolean!): Todo!
      deleteTodo(id: ID!): ID!
    }

    type Todo {
      id: ID!
      text: String!
      complete: Boolean!
    }
  `

  const resolvers = {
    Query: {
      todos: () => Todo.find()
    },
    Mutation: {
      createTodo: async (_, { text }) => {
        const todo = new Todo({ text, complete: false })

        await todo.save()

        return todo
      },
      updateTodo: async (_, { id, complete }) => {
        const todo = await Todo.findByIdAndUpdate(id, { complete }, { new: true })

        return todo
      },
      deleteTodo: async (_, { id }) => {
        await Todo.findByIdAndRemove(id)

        return id
      },
    }
  }

  const server = new ApolloServer({ typeDefs, resolvers })

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
})
