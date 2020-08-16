const mongoose = require('mongoose');

const Scema = mongoose.Schema;

const userSchema = new Scema({
  email: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
