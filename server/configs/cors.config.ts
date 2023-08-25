import cors, { CorsOptions } from 'cors';

const whitelist = ['http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export { corsOptions };
