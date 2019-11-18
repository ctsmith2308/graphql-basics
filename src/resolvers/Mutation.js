// npm module that returns random id - call uuid4() which will return something like: "6fa1436d-bea7-461a-8449-d3b7285ff496". 
// Used to generate random id for posts, comment, and id's in this example.  
import uuidv4 from 'uuid/v4';

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
  createComment(parent, args, { db }, info) {
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

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIdx = db.comments.findIndex(comment => comment.id === args.id);
    if (commentIdx === -1) throw new Error('Comment not found')

    const deletedComment = db.comments.splice(commentIdx, 1);

    return deletedComment[0];
  }
}

export default Mutation;