import { GraphQLServer } from "graphql-yoga";
// npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  
import uuidv4 from 'uuid/v4';
import db from "./db";

// RESOLVERS
// You must define a corresponding resolver method for each Query or Mutation method you create. 
const resolvers = {
  Post: { // In order to access the authors or comments from a query WITHIN a post query, resolver functions for each TYPE (author and comment) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single Post, specifically the Post within Posts above.
    // How this works is for each Post in the Posts array, the Parent (a singular Post) is passed into the author/comments resolvers 
    // below which allows the author/comments resolver functions to access the values of each Post (the parent). 
    // It is a built in GraphQL loop that queries each Post ie Parent against the find function within the resolver below
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id)
    }
  },
  User: { // In order to access the comments or posts from a query WITHIN a user query, resolver functions for each TYPE (comments and post) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single User, specifically the User within Users above.
    // How this works is for each User in the Users array, the Parent (a singular User) is passed into the posts/comments resolvers 
    // below, which allows the posts/comments resolver functions to access the values of each User (the parent). 
    // It is a built in GraphQL loop that queries each User ie Parent against the find function within the resolver below
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: { // In order to access the authors or posts from a query WITHIN a comment query, resolver functions for each TYPE (author and post) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single Comment, specifically the Comment within Comments above.
    // How this works is for each comment in the comments array, the Parent (a singular Comment) is passed into the author/posts resolvers 
    // below, which allows the author/posts resolver functions to access the values of each Comment (the parent). 
    // It is a built in GraphQL loop that queries each Comment ie Parent against the find function within the resolver below
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author)
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => post.id === parent.post)
    }
  }
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
