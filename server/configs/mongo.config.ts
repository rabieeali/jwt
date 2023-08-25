import mongoose from 'mongoose';
const { DB_URL, DB_NAME } = process.env;

const connectDB = () =>
  mongoose
    .connect(`${DB_URL}/${DB_NAME}`)
    .then(() => {
      console.log('Connected To MongoDB Successfully!');
    })
    .catch((err) => console.log(`Error! Could Not Connect To MongoDB, ${err}`));

export { connectDB };
