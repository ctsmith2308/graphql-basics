import { GraphQLServer } from "graphql-yoga";
// npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  
import uuidv4 from 'uuid/v4'; 
import db from "./db";

// RESOLVERS
// You must define a corresponding resolver method for each Query or Mutation method you create. 
const resolvers = {
  Query: {
    // args are the parameters you pass in to the defined methods within a Mutation or Query.
    // since ctx (context) has been added as a key to the new GraphQL server (see bottom of file)
    // the ctx parameter has access to the db key/values via ctx.db.users || ctx.db.posts || ctx.db.comments 
    posts(parent, args, { db }, info) { // (parent, args, { db }, info) is destructured from (parent, args, ctx, info)
      // The args here must be type String and since it is optional shit wont break. The string can be anything.
      if (!args.query) {
        return db.posts;
      } else {
        // Since the return type of posts must be an array of posts (ie [Posts!]! - again, not nullable) we are returning the array of posts.
        return db.posts.filter(
          post =>
            db.post.title.toLowerCase().indexOf(args.query.toLowerCase()) !== -1 ||
            db.post.body.toLowerCase().indexOf(args.query.toLowerCase()) !== -1
        );
      }
    },
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      } else {
        return db.users.filter(
          user =>
            user.name.toLowerCase().indexOf(args.query.toLowerCase()) !== -1
        );
      }
    },
    comments(parent, args, { db }, info) {
      if (!args.query) {
        return db.comments
      } else {
        return db.comments.filter(comment =>
          comment.text.toLowerCase().indexOf(args.query.toLowerCase()) !== -1 ||
          comment.id === args.query)
      }
    }
  },
  Mutation: {
    // The args here must have an email and name to be valid. They have a specified type defined above within the function parameters.
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error("Email taken")
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      let userIndex = db.users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      let deletedUser = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(post => {
        const match = post.author === args.id
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }

        return !match
      });
      db.comments = db.comments.filter(comment => comment.author !== args.id)

      return deletedUser[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)
      if (!userExists) {
        throw new Error("User does not exist")
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      db.posts.push(post);
      return post
    },
    deletePost(parent, args, { db }, info) {
      const postIdx = db.posts.findIndex(post => post.id === args.id)
      if (postIdx === -1) throw new Error('Post not found')

      const deletedPost = db.posts.splice(postIdx, 1);

      db.comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPost[0];
    },
    createComment(parent, args, { db }, info) {
      const postExists = db.posts.some(post => post.id === args.data.post && post.published);
      if (!postExists) {
        throw new Error("Post does not exist")
      }

      const userExists = db.users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User does not exist");
      }

      let comment = {
        id: uuidv4(),
        ...args.data
      }
      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIdx = db.comments.findIndex(comment => comment.id === args.id);
      if (commentIdx === -1) throw new Error('Comment not found')

      const deletedComment = db.comments.splice(commentIdx, 1);

      return deletedComment[0];
    }
  },
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
