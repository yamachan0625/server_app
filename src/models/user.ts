import mongoose from 'mongoose';

const Scema = mongoose.Schema;

const userSchema = new Scema({
  email: String,
  password: String,
});

export const User = mongoose.model('User', userSchema);
