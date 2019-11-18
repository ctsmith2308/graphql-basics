import { GraphQLServer } from "graphql-yoga";
// npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  
import uuidv4 from 'uuid/v4';
import db from "./db";

// RESOLVERS
// You must define a corresponding resolver method for each Query or Mutation method you create. 
const resolvers = {
  
 
 
};

// Intialize new GraphQLServer and pass in typeDefs and resolvers defined above.
// typedefs ar imported in terms of the root regardless if the typdefs are defined in the same directory
// Ex: typeDefs: './src/schema.graphql',
// context key allows access to db keys/values upon import at the top of the file. 
// Once a context is established, each resolver method has access to the context or ctx
// Ex: createComment(parent, args, ctx, info) <-- ctx has access to db via ctx.db.users (imported above)

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("Server is running");
});
