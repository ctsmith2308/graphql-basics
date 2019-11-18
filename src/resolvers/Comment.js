const Comment = {
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
}

export default Comment;