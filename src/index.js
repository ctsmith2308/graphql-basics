import { GraphQLServer } from "graphql-yoga";
import uuidv4 from 'uuid/v4'; // npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  

// DEMO DATA
const users = [
  {
    id: "1",
    name: "Chris",
    email: "some@yahoo.com",
    age: 32
  },
  {
    id: "2",
    name: "Sara",
    email: "some@yahoo.com",
    age: 32
  },
  {
    id: "3",
    name: "Rachel",
    email: "some@yahoo.com",
    age: 32
  }
];

const posts = [
  {
    id: "1",
    title: "What title",
    body: "Body of the post this",
    published: true,
    author: '1',
    comments: [11]
  },
  {
    id: "2",
    title: "This title",
    body: "Body of the post that",
    published: false,
    author: '1',
    comments: [13]
  },
  {
    id: "3",
    title: "No titles",
    body: "Body of the post what",
    published: true,
    author: '2',
    comments: [12]
  }
];

const comments = [
  {
    id: "11",
    text: "Chris is great",
    author: '1',
    post: '1'
  },
  {
    id: "12",
    text: "Sara is awesome",
    author: '2',
    post: '3'
  },
  {
    id: "13",
    text: "Rachel is annoying",
    author: '3',
    post: '2'
  }
];
// Scalar types for GraphQL - String, Boolean, Int, Float, ID
// These are used to define the types of each value within your data structures.
// "!" means a non-nullable type (this can be optional). For a return type you have specified within a Query or Mutation method it must have the key and their specified types!!!
// Ex:
// type User {
//   id: ID! <-- type of id
//   name: String! <-- type of name
//   email: String! <-- type of email
//   age: ID <-- type of age, and so forth
//   posts: [Post!]!
//   comments: [Comment!]!
// }

// QUERIES (Query) emulate 'get' requests and have optional query parameters that are passed to resolver methods (see below in Resolvers) to execute desired functionality.
// These 'get' requests are methods that can take on a parameter or not Ex: users(query: String!): [User!]! or query: [User!]! (see below for reference)
// The return type is specied after the ':' This is a non-nullable return type meaning the methods you DEFINE must return a type
// defined below - User, Post, Comment.

// MUTATIONS (Mutation) emulate 'put', 'post', 'delete' requests. They are similar to Queries, but they need paramters passed in (not optional).

// TYPE DEFINITIONS (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
  }

  type Mutation { 
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, post: ID!, author: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: ID
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// RESOLVERS
// You must define a corresponding resolver method for each Query or Mutation method you create. 
const resolvers = {
  Query: {
    // args are the parameters you pass in to the defined methods within a Mutation or Query.
    // More to come for ctx and info
    posts(parent, args, ctx, info) {
      // The args here must be type String and since it is optional shit wont break. The string can be anything.
      if (!args.query) {
        return posts;
      } else {
        // Since the return type of posts must be an array of posts (ie [Posts!]! - again, not nullable) we are returning the array of posts.
        return posts.filter(
          post =>
            post.title.toLowerCase().indexOf(args.query.toLowerCase()) !== -1 ||
            post.body.toLowerCase().indexOf(args.query.toLowerCase()) !== -1
        );
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      } else {
        return users.filter(
          user =>
            user.name.toLowerCase().indexOf(args.query.toLowerCase()) !== -1
        );
      }
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments
      } else {
        return comments.filter(comment =>
          comment.text.toLowerCase().indexOf(args.query.toLowerCase()) !== -1 ||
          comment.id === args.query)
      }
    }
  },
  Mutation: {
    // The args here must have an email and name to be valid. They have a specified type defined above within the function parameters (line 102)
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email)
      if (emailTaken) {
        throw new Error("Email taken")
      }
      const user = {
        id: uuidv4(),
        ...args
      }
      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author)
      if (!userExists) {
        throw new Error("User does not exist")
      }
      const post = {
        id: uuidv4(),
        ...args
      }
      posts.push(post);
      return post
    },
    createComment(parent, args, ctx, info) {
      const postExists = posts.some(post => post.id === args.post && post.published);
      if (!postExists) {
        throw new Error("Post does not exist")
      }

      const userExists = users.some(user => user.id === args.author);
      if (!userExists) {
        throw new Error("User does not exist");
      }

      let comment = {
        id: uuidv4(),
        ...args
      }
      comments.push(comment);

      return comment;
    },
  },
  Post: { // In order to access the authors or comments from a query WITHIN a post query, resolver functions for each TYPE (author and comment) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single Post, specifically the Post within Posts above.
    // How this works is for each Post in the Posts array, the Parent (a singular Post) is passed into the author/comments resolvers 
    // below which allows the author/comments resolver functions to access the values of each Post (the parent). 
    // It is a built in GraphQL loop that queries each Post ie Parent against the find function within the resolver below
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: { // In order to access the comments or posts from a query WITHIN a user query, resolver functions for each TYPE (comments and post) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single User, specifically the User within Users above.
    // How this works is for each User in the Users array, the Parent (a singular User) is passed into the posts/comments resolvers 
    // below, which allows the posts/comments resolver functions to access the values of each User (the parent). 
    // It is a built in GraphQL loop that queries each User ie Parent against the find function within the resolver below
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: { // In order to access the authors or posts from a query WITHIN a comment query, resolver functions for each TYPE (author and post) are needed below:
    // Note: Parent, from what I'm loosely assuming is equal to a single Comment, specifically the Comment within Comments above.
    // How this works is for each comment in the comments array, the Parent (a singular Comment) is passed into the author/posts resolvers 
    // below, which allows the author/posts resolver functions to access the values of each Comment (the parent). 
    // It is a built in GraphQL loop that queries each Comment ie Parent against the find function within the resolver below
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    }
  }
};
// intialize new GraphQLServer and pass in typeDefs and resolvers defined above.
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server is running");
});
