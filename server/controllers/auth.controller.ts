import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  hashPassword,
  sendAccessToken,
  sendRefreshToken,
  verifyUser,
} from '../lib/authUtils';
const { ACCESS_SECRET, REFRESH_SECRET, TOKEN_NAME } = process.env;

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: 'Email already exists', data: '' });
  const newUser = await UserModel.create({
    email,
    password: hashPassword(password),
  });
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: newUser,
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: 'user does not exist', data: '' });
  const valid = comparePassword(password, user.password);
  if (!valid)
    return res
      .status(403)
      .json({ success: false, message: 'wrong password', data: '' });
  const accessToken = createAccessToken(user.email);
  const refreshToken = createRefreshToken(user.email);
  user.token = refreshToken;
  await user.save();

  sendRefreshToken(req, res, refreshToken);
  sendAccessToken(req, res, accessToken);
};

const logout = (req: Request, res: Response) => {
  res.clearCookie(TOKEN_NAME!, {
    path: 'refresh',
  });
  res
    .status(200)
    .json({ success: true, message: 'logout successfully', data: '' });
};

const profile = async (req: Request, res: Response) => {
  const authorization = req?.headers?.authorization;

  if (!authorization) {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed',
      data: '',
    });
  }

  const token = authorization.split(' ')?.at(1);

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed',
      data: '',
    });
  }

  const email = verifyUser(token, ACCESS_SECRET!);

  if (email === null) {
    return res.status(401).json({
      success: false,
      message: 'unauthenticated',
      data: '',
    });
  }

  const user = await UserModel.findOne({ email });

  return res.status(200).json({
    success: true,
    message: 'Authenticated user',
    data: user,
  });
};

const refresh = async (req: Request, res: Response) => {
  const token = req.cookies[`${TOKEN_NAME}`];

  // could send an empty token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'unauthenticated', data: '' });
  }

  let payload = verifyUser(token, REFRESH_SECRET!);

  const user = await UserModel.findOne({ email: payload });
  // could send an empty token
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: 'unauthenticated', data: '' });
  }
  // could send an empty token
  if (user.token !== token) {
    return res
      .status(401)
      .json({ success: false, message: 'unauthenticated', data: '' });
  }

  const accessToken = createAccessToken(user.email);
  const refreshToken = createRefreshToken(user.email);

  user.token = refreshToken;
  await user.save();

  sendRefreshToken(req, res, refreshToken);
  sendAccessToken(req, res, accessToken);
};

export { login, register, logout, profile, refresh };
