const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSeriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, 
  },  
  rating: {
    type: String,
    ref: 'Comment', 
  },
  time: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Macera', 'Komedi'],
  },
  MovieOrSeries: {
    type: String,
    enum: ['Film', 'Dizi'],
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }]
});

const movieSeries = mongoose.model('MovieSeries', movieSeriesSchema);
module.exports = movieSeries;
