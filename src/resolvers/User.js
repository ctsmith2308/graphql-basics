const User = {
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
  }
}

export default User;