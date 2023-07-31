const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema (Şablon)
const PhotoSchema = new Schema({
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;