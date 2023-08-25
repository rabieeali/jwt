import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
const { ACCESS_SECRET, REFRESH_SECRET, TOKEN_NAME } = process.env;
const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

const comparePassword = (password: string, hashed: string) => {
  return compareSync(password, hashed);
};

const createAccessToken = (email: string) => {
  return sign({ email }, ACCESS_SECRET!, {
    expiresIn: '15min',
  });
};

const createRefreshToken = (email: string) => {
  return sign({ email }, REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

const sendAccessToken = (req: Request, res: Response, accessToken: string) => {
  return res.status(200).json({
    token: accessToken,
  });
};

const sendRefreshToken = (
  req: Request,
  res: Response,
  refreshToken: string
) => {
  return res.cookie(TOKEN_NAME!, refreshToken, {
    httpOnly: true,
    path: 'refresh',
  });
};


const verifyUser = (token: string, secret:string): string | null => {
  try {
    const decoded = verify(token, secret) as JwtPayload;
    return decoded.email;
  } catch (error) {
    return null;
  }
};
export {
  hashPassword,
  comparePassword,
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  verifyUser,
};
