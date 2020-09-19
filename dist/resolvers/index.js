"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const movie_1 = require("../models/movie");
const director_1 = require("../models/director");
const user_1 = require("../models/user");
const Query = {
    user: async (_, args, { req }) => {
        const user = await user_1.User.findById(req.userId);
        if (user) {
            return user;
        }
        else {
            return {};
        }
    },
    users: async () => {
        const users = await user_1.User.find({});
        return users;
    },
    movie: async (_, args) => {
        const movie = await movie_1.Movie.findById(args.id);
        return movie;
    },
    movies: async () => {
        const movies = await movie_1.Movie.find({});
        return movies;
    },
    director: async (_, args) => {
        const director = await director_1.Director.findById(args.id);
        return director;
    },
    directors: async () => {
        const directors = await director_1.Director.find({});
        return directors;
    },
};
const Mutation = {
    addMovoie: async (_, args) => {
        const movie = new movie_1.Movie({
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
        return movie_1.Movie.findByIdAndUpdate(args.id, updateMovie, {
            new: true,
        });
    },
    deleteMovie: async (_, args) => {
        return movie_1.Movie.findByIdAndDelete(args.id);
    },
    addDirector: async (_, args) => {
        const director = new movie_1.Movie({
            name: args.name,
            age: args.age,
        });
        return director.save();
    },
    signup: async (_, args, { res }) => {
        try {
            const existingUser = await user_1.User.findOne({
                email: args.email,
            });
            if (existingUser) {
                throw new Error('User exist already.');
            }
            const hashedPassword = await bcryptjs_1.default.hash(args.password, 12);
            const refreshToken = uuid_1.v4();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7 * 1000,
            });
            const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
            const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
            const user = new user_1.User({
                email: args.email,
                password: hashedPassword,
                refreshToken: { hash: refreshTokenHash, expiry: refreshTokenExpiry },
            });
            await user.save();
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.SECLET_KEY, { expiresIn: '1m' });
            res.cookie('token', token, {
                maxAge: 60 * 1000,
                httpOnly: true,
            });
            return { userId: user.id, token: token, refreshToken: refreshToken };
        }
        catch (error) {
            throw error;
        }
    },
    login: async (_, args, { res }) => {
        try {
            const user = await user_1.User.findOne({ email: args.email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcryptjs_1.default.compare(args.password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrct!');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.SECLET_KEY, { expiresIn: '1m' });
            res.cookie('token', token, {
                maxAge: 60 * 1000,
                httpOnly: true,
            });
            const refreshToken = uuid_1.v4();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7 * 1000,
            });
            const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
            const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
            user.refreshToken = {
                hash: refreshTokenHash,
                expiry: refreshTokenExpiry,
            };
            await user.save();
            return { userId: user.id, token: token, refreshToken: refreshToken };
        }
        catch (error) {
            throw error;
        }
    },
};
exports.resolvers = {
    Query,
    Mutation,
};
//# sourceMappingURL=index.js.map