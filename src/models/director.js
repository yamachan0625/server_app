const mongoose = require('mongoose');

const Scema = mongoose.Schema;

const directorSchema = new Scema({
  name: String,
  age: Number,
});

module.exports = mongoose.model('Director', directorSchema);
