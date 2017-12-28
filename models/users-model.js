var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   name: String,
   email: { type: String, trim: true, unique: true },
   password: String
});

module.exports= mongoose.model('user', userSchema);