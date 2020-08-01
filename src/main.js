'use strict';

const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
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

const mongoDB =
  process.env.NODE_ENV === 'production'
    ? 'mongodb://13.231.189.84:27017'
    : 'mongodb://db:27017';

mongoose.connect(mongoDB, connectOption);
const db = mongoose.connection;
db.once('open', () => {
  console.log('successfully connected to mongoDB!');
});

app.set('port', 3000);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

//ELB用のヘルスチェックパス
//パス/grapqlがstatus code 400を返す為
app.get('/health', function (req, res) {
  res.status(200).send('instance is healthy');
});

app.listen(app.get('port'), () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${app.get(
      'port'
    )}`
  );
});
