"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const altair_express_middleware_1 = require("altair-express-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./typeDefs/index");
const index_2 = require("./resolvers/index");
const index_3 = require("./contexts/index");
dotenv_1.default.config();
const app = express_1.default();
const db_user = process.env.NODE_ENV === 'production'
    ? process.env.PRO_DB_USER
    : process.env.DEV_DB_USER;
const db_pass = process.env.NODE_ENV === 'production'
    ? process.env.PRO_DB_PASS
    : process.env.DEV_DB_PASS;
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: db_user,
    pass: db_pass,
    dbName: 'testdb',
};
const mongoDB = process.env.NODE_ENV === 'production'
    ? 'mongodb://13.113.155.206:27017'
    : 'mongodb://db:27017';
mongoose_1.default.connect(mongoDB, connectOption);
const db = mongoose_1.default.connection;
db.once('open', () => {
    console.log('successfully connected to mongoDB!');
});
app.use(cookie_parser_1.default());
app.set('port', 4000);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: index_1.typeDefs,
    resolvers: index_2.resolvers,
    context: index_3.context,
    introspection: true,
    playground: true,
});
server.applyMiddleware({ app });
app.get('/health', function (req, res) {
    res.status(200).send('instance is healthy');
});
app.use('/altair', altair_express_middleware_1.altairExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
}));
app.listen(app.get('port'), () => {
    console.log(`The Express.js server has started and is listening on port number: ${app.get('port')}`);
});
//# sourceMappingURL=main.js.map