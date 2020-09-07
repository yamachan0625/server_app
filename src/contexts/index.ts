import jwt from 'jsonwebtoken';

interface Params {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const context = async ({ req, res }) => {
  // リクエストにjwttokenが含まれているかチェック
  const authToken: string = req.cookies.token;
  if (!authToken) {
    req.isAuth = false;
  }

  const decodedToken: Params = (() => {
    try {
      const params: Params = jwt.verify(authToken, process.env.SECLET_KEY);
      req.isAuth = true;
      return params;
    } catch (error) {
      req.isAuth = false;
      return { userId: '', email: '' };
    }
  })();

  req.userId = decodedToken.userId;

  return {
    req,
    res,
  };
};
