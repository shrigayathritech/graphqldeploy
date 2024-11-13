const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Sample data to store tasks
let tasks = [];
let idCounter = 1;

// Define GraphQL schema
const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    createdAt: String!
  }

  type Query {
    getTask(id: ID!): Task
    getTasks: [Task]
  }

  type Mutation {
    createTask(title: String!, description: String, status: String!): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): String
  }
`);

// Define resolvers
const root = {
  getTask: ({ id }) => tasks.find(task => task.id == id),
  getTasks: () => tasks,
  createTask: ({ title, description, status }) => {
    const task = { id: idCounter++, title, description, status, createdAt: new Date().toISOString() };
    tasks.push(task);
    return task;
  },
  updateTask: ({ id, title, description, status }) => {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) throw new Error("Task not found");

    const task = tasks[taskIndex];
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    return task;
  },
  deleteTask: ({ id }) => {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks.splice(taskIndex, 1);
    return `Task with id ${id} was deleted.`;
  },
};

// Set up the Express server
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable the GraphiQL interface for testing
  })
);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`GraphQL API server running at http://localhost:${PORT}/graphql`);
});
