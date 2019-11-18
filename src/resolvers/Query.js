const Query = {
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
  }
}

export default Query;