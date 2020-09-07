import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Movie } from '../models/movie';
import { Director } from '../models/director';
import { User } from '../models/user';

export const resolvers = {
  Query: {
    user: async (_, args, { req }) => {
      const user = await User.findById(req.userId);
      if (user) {
        return user;
      } else {
        return {};
      }
    },
    users: async () => {
      const users = await User.find({});
      return users;
    },
    movie: async (_, args) => {
      const movie = await Movie.findById(args.id);
      return movie;
    },
    movies: async () => {
      const movies = await Movie.find({});
      return movies;
    },
    director: async (_, args) => {
      const director = await Director.findById(args.id);
      return director;
    },
    directors: async () => {
      const directors = await Director.find({});
      return directors;
    },
  },
  Mutation: {
    addMovoie: async (_, args) => {
      const movie = new Movie({
        name: args.name,
        genre: args.genre,
        directorId: args.directorId || 'default',
      });
      return movie.save();
    },
    updateMovie: async (_, args) => {
      const updateMovie = new Object();
      Object.keys(args).forEach((arg) => {
        updateMovie[arg] = args[arg];
      });
      return Movie.findByIdAndUpdate(args.id, updateMovie, {
        new: true,
      });
    },
    deleteMovie: async (_, args) => {
      return Movie.findByIdAndDelete(args.id);
    },
    addDirector: async (_, args) => {
      const director = new Movie({
        name: args.name,
        age: args.age,
      });
      return director.save();
    },
    signup: async (_, args) => {
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
    login: async (_, args, { req, res }) => {
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

        return { userId: user.id, token: token };
      } catch (error) {
        throw error;
      }
    },
  },
};
