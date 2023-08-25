import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('user', UserSchema);
export { UserModel };
