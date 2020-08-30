'use strict';

const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const db_user =
  process.env.NODE_ENV === 'production'
    ? process.env.PRO_DB_USER
    : process.env.DEV_DB_USER;

const db_pass =
  process.env.NODE_ENV === 'production'
    ? process.env.PRO_DB_PASS
    : process.env.DEV_DB_PASS;

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: db_user,
  pass: db_pass,
  dbName: 'testdb',
};

const mongoDB =
  process.env.NODE_ENV === 'production'
    ? 'mongodb://13.113.155.206:27017'
    : 'mongodb://db:27017';

mongoose.connect(mongoDB, connectOption);
const db = mongoose.connection;
db.once('open', () => {
  console.log('successfully connected to mongoDB!');
});

app.use(cookieParser());

app.set('port', 4000);

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
