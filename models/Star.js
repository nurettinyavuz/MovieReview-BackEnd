const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const starSchema = new Schema({


});

const Star = mongoose.model('Star', starSchema);
module.exports = starSchema;
