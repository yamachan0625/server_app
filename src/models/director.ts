import mongoose from 'mongoose';

const Scema = mongoose.Schema;

export const directorSchema = new Scema({
  name: String,
  age: Number,
});

export const Director = mongoose.model('Director', directorSchema);
