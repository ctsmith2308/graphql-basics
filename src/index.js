import { GraphQLServer } from "graphql-yoga";
import uuidv4 from 'uuid/v4';

// Scalar types for GraphQL - String, Boolean, Int, Float, ID
// Demo user data
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


// Type definitions (schema)
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

// Resolvers
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      } else {
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
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email)
      if (emailTaken) {
        throw new Error("Email taken")
      }
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email
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
        title: args.title,
        body: args.body,
        author: args.author,
        published: args.published
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
        text: args.text,
        author: args.author,
        post: args.post
      }
      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server is running");
});
