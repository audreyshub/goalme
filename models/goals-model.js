var mongoose = require('mongoose');

var goalSchema = new mongoose.Schema({
   name: String,
   startDate: Date,
   endDate: Date,
   actions: [{type: String}]
});

module.exports= mongoose.model('goal', goalSchema);