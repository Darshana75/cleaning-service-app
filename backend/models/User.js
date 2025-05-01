const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password_hash: { type: String },
  isAdmin: { type: Boolean, default: false } 
});

userSchema.methods.setPassword = async function(password) {
  this.password_hash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);
