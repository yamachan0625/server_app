declare namespace Express {
  interface Request {
    isAuth: boolean;
    userId: string;
  }
}
