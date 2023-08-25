import { NextFunction, Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response, next:NextFunction) => {
  const route = req.url;
  res.status(404).json({ error: `route '${route}' not found!` });
  next()
};
export { notFoundHandler };
