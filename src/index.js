import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

// NOTE on RESOLVERS - IMPORTANT!!!
// You must define a corresponding resolver method for each method you create within the Query and Mutation type defs
// type Query {
//   users(query: String): [User!]! <-- Resolver for type Query must have this method
//   posts(query: String): [Post!]!
//   comments(query: String): [Comment!]!
// } 

// type Mutation { 
//   createUser(data: CreateUserInput): User! <--- Resolver for type Mutation must have this method
//   deleteUser(id: ID!): User!
//   createPost(data: CreatePostInput): Post!
//   deletePost(id: ID!): Post!
//   ...
// }

// IMPORTANT:
// All resolver method parameters have/need access to (parent, args, ctx, info)

// Ex: see Query.js and Mutations.js for examples). 
// someResolver(parent, args, ctx, info){ <--- args refers to the parameters passed in by the actual query request, ctx is context (defined below).
//   do something...
// }

// Intialize new GraphQLServer and pass in typeDefs resolvers, and context.

// new Pubsub is needed to establish pub sub relationship in subscriber methods to listen in on changes/mutations
// pubsub is then passed into context so that subscriber methods have access to the ctx.pubsub value.
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // typedefs are imported in terms of the root regardless if the typdefs are defined in the same directory
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  // Once a context is established, each resolver method has access to the context or `ctx` parameter within the method body.
  // createComment(parent, args, ctx, info) <-- ctx has access to db via `ctx.db.users` (imported above)
  // NOTE: resolver methods now have access to the ctx.db object that contains users, posts, and comments arrays.
  context: { // context key allows access to db keys/values upon import at the top of the file. 
    db,
    pubsub
  }
});

server.start(() => {
  console.log("Server is running");
});
