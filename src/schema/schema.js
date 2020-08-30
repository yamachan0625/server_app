const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Movie = require('../models/movie');
const Director = require('../models/director');
const User = require('../models/user');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//DBのカラムと型を定義？
const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Director.findById(parent.directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({ directorId: parent.id });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const AuthsType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parents, args) {
        return User.find({});
      },
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLString } },
      resolve(parents, args) {
        return Movie.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLString } },
      resolve(parents, args) {
        return Director.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Director.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, req) {
        try {
          const existingUser = await User.findOne({
            email: args.email,
          });

          if (existingUser) {
            throw new Error('User exist already.');
          }

          const hashedPassword = await bcrypt.hash(args.password, 12);

          const user = new User({
            email: args.email,
            password: hashedPassword,
          });

          return user.save();
        } catch (error) {
          throw error;
        }
      },
    },
    login: {
      type: AuthsType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, { res }) {
        try {
          const user = await User.findOne({ email: args.email });

          if (!user) {
            return new Error('User does not exist!');
          }

          const isEqual = await bcrypt.compare(args.password, user.password);

          if (!isEqual) {
            throw new Error('Password is incorrct!');
          }

          const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECLET_KEY,
            { expiresIn: '1h' }
          );

          res.cookie('token', token, { httpOnly: true });

          return { userId: user.id, token: token, tokenExpiration: 1 };
        } catch (error) {
          throw error;
        }
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(parents, args) {
        const movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parents, args) {
        let director = new Director({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let updateMovie = {};
        if (args.name) {
          updateMovie.name = args.name;
        }
        if (args.genre) {
          updateMovie.genre = args.genre;
        }
        if (args.directorId) {
          updateMovie.directorId = args.directorId;
        }
        // args.name && (updateDirector.name = args.name);
        // args.age && (updateDirector.age = args.age);
        return Movie.findByIdAndUpdate(args.id, updateMovie, {
          new: true,
        });
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let updateDirector = {};
        if (args.name) {
          updateDirector.name = args.name;
        }
        if (args.age) {
          updateDirector.age = args.age;
        }
        // args.name && (updateDirector.name = args.name);
        // args.age && (updateDirector.age = args.age);
        return Director.findByIdAndUpdate(args.id, updateDirector, {
          new: true,
        });
      },
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Movie.findByIdAndRemove(args.id);
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Director.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
