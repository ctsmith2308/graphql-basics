const Post = { 
// In order to access the authors or comments from WITHIN a post query, 
// resolver functions for each type def (author and comment in schema.graphql) are needed below:

// Note: Parent, from what I'm loosely assuming is equal to a single Post, specifically the Post within db.posts above.

// How this works is for each Post in the Posts array, the Parent (a singular Post) is passed into the author/comments resolvers 
// below, which allows the author/comments resolver functions to access the values of each Post (the parent). 
// It is a built in GraphQL loop that queries each Post ie Parent against the built in JS find function within the resolver below.

// Ex:
// query {
//   posts {
//     id
//     comments {
//       id
//       text
//       post {
//         id
//       }
//     }
//   }
// }

  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.author)
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => comment.post === parent.id)
  }
}

export default Post;