const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      // pubsub is made available here because we passed a new Pubsub contructor 
      // via context in new GraphQLServer in index.js
      const post = db.posts.find(post => post.id === postId && post.published)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment ${postId}`) // this is the subscriber for the publish method call within createComment resolver method.
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      // Subscribe to the 'post' event and listen for ANY published events defined with Mutation resolver methods.
      return pubsub.asyncIterator('post')
    }
  }
}

export default Subscription