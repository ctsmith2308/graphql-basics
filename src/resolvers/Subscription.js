const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment ${postId}`) // this is the subscriber for the publish method call within createPost resolver method.
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}

export default Subscription