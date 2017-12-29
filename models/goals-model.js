var mongoose = require('mongoose');

var goalSchema = new mongoose.Schema({
   name: String,
   startDate: Date,
   endDate: Date,
   actions: [{type: String}],
   user: mongoose.Schema.ObjectId
});

module.exports= mongoose.model('goal', goalSchema);