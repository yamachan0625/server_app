import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { Movie } from '../models/movie';
import { Director } from '../models/director';
import { User } from '../models/user';
import { Matter } from '../models/matter';
import { Job } from '../models/job';
import {
  QueryResolvers,
  MutationResolvers,
  Resolvers,
} from '../generated/graphql';

const Query: QueryResolvers = {
  user: async (_, args, { req }) => {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('ユーザーは存在しません');
    }
    return user;
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
  matters: async () => {
    const matters = await Matter.find({});
    return matters;
  },
  jobs: async () => {
    const jobs = await Job.find({});
    return jobs;
  },
  getBarChartList: async (_, { date, sortOrder }) => {
    const barChartRrsponse: any = {};
    barChartRrsponse['scrapingDate'] = date;

    const startDate = dayjs(date).add(9, 'hour').format('YYYY-MM-DD');
    const endDate = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');

    // フロントで選択された日付のデータのみ取得する
    const sortedDateData = await Job.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const jobData = [];
    sortedDateData.forEach((data) => {
      const dataObj = {};
      dataObj['siteName'] = data.siteName;

      const jobList: [string, unknown][] = Object.entries(data.jobData);
      // NOTE:配列の先頭に[ '$init', true ]という値が入ってしまうため削除
      jobList.shift();
      const sortedJobList = jobList.sort(
        (a: [string, number], b: [string, number]) => a[1] - b[1]
      );

      const skillName = [];
      const jobVacancies = [];
      sortedJobList.forEach((data) => {
        skillName.push(data[0]);
        jobVacancies.push(data[1]);
      });
      dataObj['skillName'] = skillName;
      dataObj['jobVacancies'] = jobVacancies;
      dataObj['chartColor'] = [
        'rgba(62, 134, 61, 0.5)',
        'rgba(97, 219, 251, 0.5)',
        'rgba(221, 0, 49, 0.5)',
        'rgba(65, 184, 131, 0.5)',
        'rgba(0, 0, 0, 0.5)',
        'rgba(63,115,102,0.5)',
        'rgba(49, 120, 198, 0.5)',
        'rgba(253, 216, 60, 0.5)',
        'rgba(0, 164, 211, 0.5)',
        'rgba(97, 202, 250, 0.5)',
        'rgba(59, 126, 138, 0.5)',
        'rgba(229, 53, 171, 0.5)',
        'rgba(118, 74, 188, 0.5)',
        'rgba(93, 183, 133, 0.35)',
        'rgba(153, 66, 91, 0.5)',
        'rgba(71, 71, 75, 0.8)',
        'rgba(142, 214, 251, 0.5)',
      ];
      dataObj['chartBorderColor'] = [
        'rgba(62, 134, 61, 0.5)',
        'rgba(97, 219, 251, 0.5)',
        'rgba(221, 0, 49, 0.5)',
        'rgba(65, 184, 131, 0.5)',
        'rgba(0, 0, 0, 0.5)',
        'rgba(63,115,102,0.5)',
        'rgba(49, 120, 198, 0.5)',
        'rgba(253, 216, 60, 0.5)',
        'rgba(0, 164, 211, 0.5)',
        'rgba(97, 202, 250, 0.5)',
        'rgba(59, 126, 138, 0.5)',
        'rgba(229, 53, 171, 0.5)',
        'rgba(118, 74, 188, 0.5)',
        'rgba(93, 183, 133, 0.35)',
        'rgba(153, 66, 91, 0.5)',
        'rgba(71, 71, 75, 0.8)',
        'rgba(142, 214, 251, 0.5)',
      ];

      jobData.push(dataObj);
    });

    barChartRrsponse['jobData'] = jobData;
    return barChartRrsponse;
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
  signup: async (_, args, { res }) => {
    try {
      const existingUser = await User.findOne({
        email: args.email,
      });

      if (existingUser) {
        throw new Error('このメールアドレスは既に使用されています');
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);

      // refreshtokenをuuidv4を利用しランダムで作成
      const refreshToken = uuidv4();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });

      // refreshTokenのハッシュ化
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // 有効期限を一週間に設定
      const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

      const user = new User({
        email: args.email,
        password: hashedPassword,
        refreshToken: { hash: refreshTokenHash, expiry: refreshTokenExpiry },
      });

      await user.save();

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECLET_KEY,
        { expiresIn: '1m' }
      );

      res.cookie('token', token, {
        maxAge: 60 * 1000,
        httpOnly: true,
      });

      return { userId: user.id, token: token, refreshToken: refreshToken };
    } catch (error) {
      throw error;
    }
  },
  login: async (_, args, { res }) => {
    try {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error('メールアドレスが間違っています');
      }

      const isEqual = await bcrypt.compare(args.password, user.password);

      if (!isEqual) {
        throw new Error('パスワードが間違っています');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECLET_KEY,
        { expiresIn: '1m' }
      );

      res.cookie('token', token, {
        maxAge: 60 * 1000,
        httpOnly: true,
      });

      // refreshtokenをuuidv4を利用しランダムで作成
      const refreshToken = uuidv4();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });

      // refreshTokenのハッシュ化
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // 有効期限を一週間に設定
      const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

      // ユーザーのrefreshTokenを更新する
      user.refreshToken = {
        hash: refreshTokenHash,
        expiry: refreshTokenExpiry,
      };

      await user.save();

      return { userId: user.id, token: token, refreshToken: refreshToken };
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (_, args, { req }) => {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('ユーザーは存在しません');
    }

    const isEqual = await bcrypt.compare(args.currentPassword, user.password);
    if (!isEqual) {
      throw new Error('パスワードが間違っています');
    }

    const newPassword = (() => {
      if (args.confirmNewPassword === args.newPassword) return args.newPassword;
      throw new Error('パスワードが一致しません');
    })();

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    return await user.save();
  },
};

export const resolvers: Resolvers = {
  Query,
  Mutation,
};
