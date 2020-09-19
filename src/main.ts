import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import { typeDefs } from './typeDefs/index';
import { resolvers } from './resolvers/index';
import { context } from './contexts/index';

require('dotenv').config();

const app = express();

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app });

//ELB用のヘルスチェックパス
//パス/grapqlがstatus code 400を返す為
app.get('/health', function (req: Request, res: Response) {
  res.status(200).send('instance is healthy');
});

app.use(
  '/altair',
  altairExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
  })
);

app.listen(app.get('port'), () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${app.get(
      'port'
    )}`
  );
});
