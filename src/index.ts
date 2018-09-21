import { GraphQLServer } from 'graphql-yoga'
import gql from "graphql-tag";

import { items } from './db'

const typeDefs = gql`
    type Item {
        _id: String!
        name: String!
    }
    type Query {
        getItems: [Item]!
        getItem(_id: String!): Item
    }
    type Mutation {
        createItem(name: String!): Item
        updateItem(_id: String! name: String!): Boolean
        deleteItem(_id: String!): Boolean
    }
`;

const collection = 'items';

const resolvers = {
  Query: {
    getItems: () => items.find(),
    getItem: (_, {_id}) => items.findOne(_id)
  },
  Mutation: {
    createItem: (_, {name}) => items.create({name}),
    updateItem: (_, {_id, name}) => items.update(_id, {name}),
    deleteItem: (_, {_id}) => items.delete(_id),
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
