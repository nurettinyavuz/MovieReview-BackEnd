const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  taxNumber: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Organizer = mongoose.model('Organizer', OrganizerSchema);
module.exports = Organizer;
