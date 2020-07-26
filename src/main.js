'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: 'testdb',
};

mongoose.connect('mongodb://db:27017', connectOption);
const db = mongoose.connection;
db.once('open', () => {
  console.log('successfully connected to mongoDB');
});

app.set('port', 3000);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(app.get('port'), () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${app.get(
      'port'
    )}`
  );
});
