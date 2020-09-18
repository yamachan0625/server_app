import mongoose from 'mongoose';

const Scema = mongoose.Schema;

const userSchema = new Scema({
  email: String,
  password: String,
  refreshToken: {
    hash: String,
    expiry: Date,
  },
});

export const User = mongoose.model('User', userSchema);
