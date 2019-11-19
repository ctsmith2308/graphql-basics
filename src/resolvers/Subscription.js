const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment ${postId}`) // this is the subscriber for the publish method call within createComment resolver method.
    }
  },
  // comment: {
  //   subscribe(parent, args, { pubsub }, info) {
  //     // Subscribe to the 'comment' event and listen for any published events defined with Mutation resolver methods.
  //     return pubsub.asyncIterator('comment')
  //   }
  // },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      // Subscribe to the 'post' event and listen for any published events defined with Mutation resolver methods.
      return pubsub.asyncIterator('post')
    }
  }
}

export default Subscription