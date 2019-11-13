import { GraphQLServer } from "graphql-yoga";

// Scalar types for GraphQL - String, Boolean, Int, Float, ID
// Demo user data
const users = [
  {
    id: "1",
    name: "Chris",
    email: "some@yahoo.com"
  },
  {
    id: "2",
    name: "Sara",
    email: "some@yahoo.com"
  },
  {
    id: "3",
    name: "Rachel",
    email: "some@yahoo.com"
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

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
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
      return comments
    }
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
