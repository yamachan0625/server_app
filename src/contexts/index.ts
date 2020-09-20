import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/user';

const remakeTokens = async (req, res) => {
  const { refreshToken, userId } = req.cookies;

  const foundUser = await User.findById(userId);

  const isMatch: boolean = bcrypt.compareSync(
    refreshToken,
    foundUser.refreshToken.hash
  );

  const isValid: boolean = foundUser.refreshToken.expiry > Date.now();

  if (isMatch && isValid) {
    const newRefreshToken = uuidv4();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    const newRefreshTokenExpiry = new Date(
      Date.now() + 60 * 60 * 24 * 7 * 1000
    );

    foundUser.refreshToken = {
      hash: newRefreshTokenHash,
      expiry: newRefreshTokenExpiry,
    };

    await foundUser.save();

    const newToken = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      process.env.SECLET_KEY,
      { expiresIn: '1m' }
    );

    res.cookie('token', newToken, {
      maxAge: 60 * 1000,
      httpOnly: true,
    });

    req.isAuth = true;
    req.userId = userId;
  }
};

export const context = async ({ req, res }) => {
  const { token, refreshToken, userId } = req.cookies;
  req.isAuth = false;
  req.userId = '';

  if (!userId) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return {
      req,
      res,
    };
  }

  if (token) {
    try {
      const decodedToken: any = jwt.verify(token, process.env.SECLET_KEY);
      req.isAuth = true;
      req.userId = decodedToken.userId;
    } catch (error) {
      // tokenがデコードできなかった場合トークンを再発行する
      await remakeTokens(req, res);
    }
  } else {
    // refreshToken && userIdの場合トークンを再発行する
    if (refreshToken && userId) {
      await remakeTokens(req, res);
    }
  }

  return {
    req,
    res,
  };
};
