const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  email : String,
  password : String,
  token: String,
  officesToken: [String],
});

const User = mongoose.model('users', userSchema);

module.exports = User;