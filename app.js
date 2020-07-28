const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Every host, client can send request.
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS'); //Which requests are allowed
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHttp({
    // Query: get data
    // Mutation: create, edit, remove data
    // '!' means not nullable or optional.
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bookingdb.bkxjf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port);
    console.log(`DB is ready on ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
