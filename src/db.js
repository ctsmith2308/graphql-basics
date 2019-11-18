const users = [
  {
    id: "1",
    name: "Chris",
    email: "some@yahoo.com",
    age: 32
  },
  {
    id: "2",
    name: "Sara",
    email: "some@yahoo.com",
    age: 32
  },
  {
    id: "3",
    name: "Rachel",
    email: "some@yahoo.com",
    age: 32
  }
];

const posts = [
  {
    id: "1",
    title: "What title",
    body: "Body of the post this",
    published: true,
    author: '1',
  },
  {
    id: "2",
    title: "This title",
    body: "Body of the post that",
    published: false,
    author: '1',
  },
  {
    id: "3",
    title: "No titles",
    body: "Body of the post what",
    published: true,
    author: '2',
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

const db = {
  users,
  posts,
  comments
}

export default db