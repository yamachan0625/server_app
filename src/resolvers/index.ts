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
import {
  Job as JobType,
  LineChartSkillData,
  LineChartJobData,
  JobData,
} from '../generated/graphql';

const skillOptionObj = {
  NodeJs: {
    name: 'Node.js',
    color: 'rgba(62, 134, 61, 1)',
    transparentColor: 'rgba(62, 134, 61, 0.5)',
  },
  React: {
    name: 'React',
    color: 'rgba(97, 219, 251, 1)',
    transparentColor: 'rgba(97, 219, 251, 0.5)',
  },
  Angular: {
    name: 'Angular',
    color: 'rgba(221, 0, 49, 1)',
    transparentColor: 'rgba(221, 0, 49, 0.5)',
  },
  VueJs: {
    name: 'Vue.js',
    color: 'rgba(65, 184, 131, 1)',
    transparentColor: 'rgba(65, 184, 131, 0.5)',
  },
  NextJs: {
    name: 'Next.js',
    color: 'rgba(0, 0, 0, 1)',
    transparentColor: 'rgba(0, 0, 0, 0.5)',
  },
  NuxtJs: {
    name: 'Nuxt.js',
    color: 'rgba(63, 115, 102, 1)',
    transparentColor: 'rgba(63, 115, 102, 0.5)',
  },
  TypeScript: {
    name: 'TypeScript',
    color: 'rgba(49, 120, 198, 1)',
    transparentColor: 'rgba(49, 120, 198, 0.5)',
  },
  JavaScript: {
    name: 'JavaScript',
    color: 'rgba(253, 216, 60, 1)',
    transparentColor: 'rgba(253, 216, 60, 0.5)',
  },
  ReactNative: {
    name: 'ReactNative',
    color: 'rgba(0, 164, 211, 1)',
    transparentColor: 'rgba(0, 164, 211, 0.5)',
  },
  Flutter: {
    name: 'Flutter',
    color: 'rgba(97, 202, 250, 1)',
    transparentColor: 'rgba(97, 202, 250, 0.5)',
  },
  Electron: {
    name: 'Electron',
    color: 'rgba(59, 126, 138, 1)',
    transparentColor: 'rgba(59, 126, 138, 0.5)',
  },
  Graphql: {
    name: 'Graphql',
    color: 'rgba(229, 53, 171, 1)',
    transparentColor: 'rgba(229, 53, 171, 0.5)',
  },
  Redux: {
    name: 'Redux',
    color: 'rgba(118, 74, 188, 1)',
    transparentColor: 'rgba(118, 74, 188, 0.5)',
  },
  VueX: {
    name: 'VueX',
    color: 'rgba(93, 183, 133, 1)',
    transparentColor: 'rgba(93, 183, 133, 0.35)',
  },
  Jest: {
    name: 'Jest',
    color: 'rgba(153, 66, 91, 1)',
    transparentColor: 'rgba(153, 66, 91, 0.5)',
  },
  Cypress: {
    name: 'Cypress',
    color: 'rgba(71, 71, 75, 1)',
    transparentColor: 'rgba(71, 71, 75, 0.8)',
  },
  Webpack: {
    name: 'Webpack',
    color: 'rgba(142, 214, 251, 1)',
    transparentColor: 'rgba(142, 214, 251, 0.5)',
  },
} as const;

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
  getBarChartList: async (
    _,
    { date, sortOrder }: { date: Date; sortOrder: string }
  ) => {
    // ソートに使用する
    const startDate = dayjs(date).add(9, 'hour').format('YYYY-MM-DD');
    const endDate = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');

    // クライアントで選択された日付のデータを取得する
    const sortDateData: JobType[] = await Job.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const jobData: JobData[] = sortDateData.reduce((acc, data) => {
      const dataObj = {
        siteName: data.siteName,
        skillName: [],
        jobVacancies: [],
        chartColor: [],
        chartBorderColor: [],
      };

      const jobList: [string, number | 'SkillName'][] = Object.entries(
        data.jobData
      );
      // NOTE:配列の先頭に[ '$init', true ]という値が入ってしまうため削除
      jobList.shift();

      // [['react', 100]]のような二次元配列の[1]番目の数字を利用しソート
      const sortedJobList = (() => {
        if (sortOrder === '昇順')
          return jobList.sort(
            (a: [string, number], b: [string, number]) => a[1] - b[1]
          );

        if (sortOrder === '降順')
          return jobList.sort(
            (a: [string, number], b: [string, number]) => b[1] - a[1]
          );
        return jobList;
      })();

      sortedJobList.forEach((data) => {
        dataObj['skillName'].push(skillOptionObj[data[0]].name);
        dataObj['chartColor'].push(skillOptionObj[data[0]].transparentColor);
        dataObj['chartBorderColor'].push(skillOptionObj[data[0]].color);
        dataObj['jobVacancies'].push(data[1]);
      });

      return acc.concat(dataObj as JobData);
    }, []);

    const minDate = await Job.find().sort({ date: 1 }).limit(1);
    return {
      scrapingDate: date,
      /** フロントで使用しているreact-datepickerの関係上dateを使用できる形式に変更して返す
       * TODO: ここの処理見直したい
       */
      minDate: new Date(
        dayjs(minDate[0].date).add(-9, 'hour').format('')
      ).toString(),
      jobData,
    };
  },
  getLineChartList: async (_, { dateRange, skills }) => {
    const dateRangeNum = (() => {
      if (dateRange === '1ヶ月') return -30;
      if (dateRange === '3ヶ月') return -90;
      return -7;
    })();

    // NOTE: 午前03時にデータが更新されるため0４時から当日データを参照するようにする
    //       (9(日本時間との差分) - 4(午前４時) = 5(DBが更新されてから当日とみなし、データにアクセスする))
    const now = dayjs().add(5, 'hour');

    const endDate = now.add(24, 'hour').format('YYYY-MM-DD');
    const startDate = dayjs(endDate)
      .add(dateRangeNum, 'day')
      .format('YYYY-MM-DD');

    // 日付で範囲指定し日付で昇順にソートする
    const sortDateData: JobType[] = await Job.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    const rangeDate: Set<string> = new Set();
    const siteList: Set<string> = new Set();
    sortDateData.forEach((data) => {
      rangeDate.add(dayjs(data.date).format('YYYY/MM/DD'));
      siteList.add(data.siteName);
    });

    const jobData = [...siteList].map((siteName) => {
      // サイトごとにデータをフィルタする
      const jobSiteData = sortDateData.filter(
        (data) => data.siteName === siteName
      );
      // 最終的にreturnするオブジェクトを定義
      const jobDataObj = {};

      const skillData = skills.reduce((skillDataArray, skill) => {
        // 求人数を格納するための配列
        const jobVacanciesArray = [];

        const chartData = jobSiteData.reduce((chartDataObj, data, i) => {
          jobVacanciesArray.push(data.jobData[skill]);

          if (i === jobSiteData.length - 1) {
            chartDataObj['label'] = skillOptionObj[skill].name;
            chartDataObj['borderColor'] = skillOptionObj[skill].color;
            chartDataObj['data'] = jobVacanciesArray;
          }
          return chartDataObj;
        }, {} as LineChartSkillData);

        return skillDataArray.concat(chartData);
      }, [] as LineChartSkillData[]);

      jobDataObj['skillData'] = skillData;
      jobDataObj['siteName'] = siteName;
      return jobDataObj as LineChartJobData;
    });

    return {
      rangeDate: [...rangeDate],
      jobData,
    };
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
      throw new Error('現在のパスワードが間違っています');
    }

    const newPassword = (() => {
      if (args.confirmNewPassword === args.newPassword) return args.newPassword;
      throw new Error('新しいパスワードが一致しません');
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
