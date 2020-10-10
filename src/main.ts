import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { typeDefs } from './typeDefs/index';
import { resolvers } from './resolvers/index';
import { context } from './contexts/index';
import { continueScreemshot } from './scraping';
import { postQiita } from './postQiita';

dotenv.config();

const app = express();

//データ収集定期実行
cron.schedule('*/1 * * * *', () => {
  continueScreemshot();
  // postQiita();
});

// scrapingのテスト
cron.schedule('0 12 * * *', () => {
  continueScreemshot();
});

//Qiitaの定期投稿
cron.schedule('0 8 * * *', () => {
  postQiita();
});

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        user: process.env.DEV_DB_USER,
        pass: process.env.DEV_DB_PASS,
        dbName: 'testdb',
      }),
};

const mongoDB =
  process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${process.env.PRO_DB_USER}:${process.env.PRO_DB_PASS}@portfolio.tzurq.mongodb.net/${process.env.PRO_DB_NAME}?retryWrites=true&w=majority`
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
  // 下2つのオプションは本番環境でgraphiqlを使用するために必須
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
