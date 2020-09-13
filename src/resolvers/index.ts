import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { Movie } from '../models/movie';
import { Director } from '../models/director';
import { User } from '../models/user';
import {
  QueryResolvers,
  MutationResolvers,
  Resolvers,
} from '../generated/graphql';

const Query: QueryResolvers = {
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
  director: async (_, args: any) => {
    const director = await Director.findById(args.id);
    return director;
  },
  directors: async () => {
    const directors = await Director.find({});
    return directors;
  },
};

const Mutation: MutationResolvers = {
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

      // refreshtokenをuuidv4を利用しランダムで作成
      const refreshToken = uuidv4();

      // refreshTokenのハッシュ化
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // 有効期限を一週間に設定
      const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

      const user = new User({
        email: args.email,
        password: hashedPassword,
        refreshTokens: [{ hash: refreshTokenHash, expiry: refreshTokenExpiry }],
      });

      await user.save();

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECLET_KEY,
        { expiresIn: '1m' }
      );

      return { userId: user.id, token: token };
    } catch (error) {
      throw error;
    }
  },
  // @ts-ignore: エラー原因不明
  login: async (_, args) => {
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
        { expiresIn: '1m' }
      );

      // refreshtokenをuuidv4を利用しランダムで作成
      const refreshToken = uuidv4();

      // refreshTokenのハッシュ化
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // 有効期限を一週間に設定
      const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

      // ユーザーのrefreshTokenを更新する
      user.refreshTokens.push({
        hash: refreshTokenHash,
        expiry: refreshTokenExpiry,
      });

      await user.save();

      return { userId: user.id, token: token };
    } catch (error) {
      throw error;
    }
  },
};

export const resolvers: Resolvers = {
  Query,
  Mutation,
};
