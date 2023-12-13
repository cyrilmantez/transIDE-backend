const mongoose = require('mongoose');
const { boolean } = require('yargs');

const userSchema = mongoose.Schema({
  username: String,
  email : String,
  password : String,
  token: String,
  officesToken: [{
    name : String,
    token : String,
    isByDefault : Boolean,
  }],
});

const User = mongoose.model('users', userSchema);

module.exports = User;