import { GraphQLServer } from "graphql-yoga";

// Scalar types for GraphQL - String, Boolean, Int, Float, ID
// Demo user data
const users = [
  { id: "1", name: "Chris", email: "some@yahoo.com" },
  { id: "2", name: "Sara", email: "some@yahoo.com" },
  { id: "3", name: "Rachel", email: "some@yahoo.com" }
];

const posts = [
  {
    id: "1",
    title: "What title",
    body: "Body of the post this",
    published: true
  },
  {
    id: "2",
    title: "This title",
    body: "Body of the post that",
    published: false
  },
  {
    id: "3",
    title: "No titles",
    body: "Body of the post what",
    published: true
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
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
    me() {
      return {
        id: "123",
        name: "Chris Smith",
        email: "yahoo@yahoo.com",
        age: null
      };
    },
    post() {
      return {
        id: "345",
        title: "First Post",
        body: "I am the body of the post",
        published: true
      };
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
