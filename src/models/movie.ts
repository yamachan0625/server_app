import mongoose from 'mongoose';

const Scema = mongoose.Schema;

export const movieSchema = new Scema({
  name: String,
  genre: String,
  directorId: String,
});

export const Movie = mongoose.model('Movie', movieSchema);
