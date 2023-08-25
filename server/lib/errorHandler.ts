import { Request, Response } from 'express';

const errorHandler = (err: any, req: Request, res: Response) => {
  const status = err?.status ?? err?.statusCode ?? 500;
  res.status(status).json({
    statusCode: status,
    message: err?.message ?? 'Internal Server Error',
  });
};

export { errorHandler };
