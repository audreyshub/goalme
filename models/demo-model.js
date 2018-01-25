var mongoose = require('mongoose');

var demoSchema = new mongoose.Schema({
   name: String,
   startDate: Date,
   endDate: Date,
   actions: [{type: String}],
   user: mongoose.Schema.ObjectId
});

module.exports= mongoose.model('demo', demoSchema);