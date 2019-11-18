// npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  
import uuidv4 from 'uuid/v4';
import { cpus } from 'os';

const Mutation = {
  // The args here must have an email and name to be valid. They have a specified type defined within the type definitions.
  // The type def for this resolver method is type `CreateUserInput` which requires data: {name: value, email: value, age: optional} to be valid.

  // EX: In sandbox mutation request
  // mutation {
  //   createUser(data: {name: value, email: value, age: optional}) {
  //     id
  //     name
  //   }
  // }

  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email)
    if (emailTaken) {
      throw new Error("Email taken")
    }
    const user = {
      id: uuidv4(),
      ...args.data
    }
    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    let userIndex = db.users.findIndex(user => user.id === args.id);
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    let deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === args.id
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    });
    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUser[0];
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id)
    if (!user) throw new Error('User not found');

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) throw new Error('Email in use')

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    if (!userExists) {
      throw new Error("User does not exist")
    }
    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post);
    return post
  },
  deletePost(parent, args, { db }, info) {
    const postIdx = db.posts.findIndex(post => post.id === args.id)
    if (postIdx === -1) throw new Error('Post not found')

    const deletedPost = db.posts.splice(postIdx, 1);

    db.comments = db.comments.filter(comment => comment.post !== args.id);

    return deletedPost[0];
  },
  updatePost(parent, { id, data }, { db }, info) {
    const post = db.posts.find(post => post.id === id);
    if (!post) throw new Error('Post not found')

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published
    }

    // Not sure if you would want to change the author id when updating the post
    // if (typeof data.author === 'string') {
    //   const authorExists = db.users.some(user => user.id === data.author)
    //   if (!authorExists) throw new Error('Author does not exist')

    //   post.author = data.author
    // }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const postExists = db.posts.some(post => post.id === args.data.post && post.published);
    if (!postExists) {
      throw new Error("Post does not exist")
    }

    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User does not exist");
    }

    let comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, { comment })

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIdx = db.comments.findIndex(comment => comment.id === args.id);
    if (commentIdx === -1) throw new Error('Comment not found')

    const deletedComment = db.comments.splice(commentIdx, 1);

    return deletedComment[0];
  },
  updateComment(parent, { id, data }, { db }, info) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error('Comment not found');

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    return comment;
  }
}

export default Mutation;