"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
dotenv_1.default.config();
const remakeTokens = async (req, res) => {
    req.isAuth = false;
    req.userId = '';
    const { refreshToken, userId } = req.cookies;
    const foundUser = await user_1.User.findById(userId);
    const isMatch = bcryptjs_1.default.compareSync(refreshToken, foundUser.refreshToken.hash);
    const isValid = foundUser.refreshToken.expiry > Date.now();
    if (isMatch && isValid) {
        const newRefreshToken = uuid_1.v4();
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,
        });
        const newRefreshTokenHash = await bcryptjs_1.default.hash(newRefreshToken, 10);
        const newRefreshTokenExpiry = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
        foundUser.refreshToken = {
            hash: newRefreshTokenHash,
            expiry: newRefreshTokenExpiry,
        };
        await foundUser.save();
        const newToken = jsonwebtoken_1.default.sign({ userId: foundUser.id, email: foundUser.email }, process.env.SECLET_KEY, { expiresIn: '1m' });
        res.cookie('token', newToken, {
            maxAge: 60 * 1000,
            httpOnly: true,
        });
        req.isAuth = true;
        req.userId = userId;
    }
};
exports.context = async ({ req, res }) => {
    const { token, refreshToken, userId } = req.cookies;
    if (token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECLET_KEY);
            req.isAuth = true;
            req.userId = decodedToken.userId;
        }
        catch (error) {
            await remakeTokens(req, res);
        }
    }
    else {
        if (refreshToken && userId) {
            await remakeTokens(req, res);
        }
        else {
            req.isAuth = false;
            req.userId = '';
        }
    }
    return {
        req,
        res,
    };
};
//# sourceMappingURL=index.js.map