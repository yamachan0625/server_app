import mongoose from 'mongoose';

const Scema = mongoose.Schema;

export const matterSchema = new Scema({
  numberOfCase: Number,
});

export const Matter = mongoose.model('Matter', matterSchema);
