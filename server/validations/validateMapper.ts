import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validationMapper = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  const errMsg = errors.array().map((e: any) => ({ [e.path]: e.msg }));

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errMsg });
  }
  next()
};

export { validationMapper };
