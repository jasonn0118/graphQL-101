const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    // Query: get data
    // Mutation: create, edit, remove data
    // '!' means not nullable or optional.
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        try {
          return Event.find();
        } catch (err) {
          throw err;
        }
        // Event.find()
        //     .catch(err => {
        //         console.log(err)
        //         throw err;
        //     });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5f0f561094122e609b7d5977'
        });
        let createdEvent
        return event
          .save()
          .then((res) => {
            createdEvent = { ...res._doc };
            return User.findById('5f0f561094122e609b7d5977');
          })
          .then(user => {
            if (!user) {
                throw new Error('User not found.')
            }
            user.createdEvents.push(event)
            return user.save();
          })
          .then(res => {
            console.log(res);
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email }).then((user) => {
            if (user) {
                throw new Error('User exists already')
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
        .then((hashedPassword) => {
        const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
        });
        return user.save();
        })
        .then((res) => {
        return { ...res._doc, password: null, _id: res.id };
        })
        .catch((err) => {
        throw err;
        });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bookingdb.bkxjf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('DB is ready');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
