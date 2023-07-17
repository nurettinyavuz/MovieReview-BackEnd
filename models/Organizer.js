const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const OrganizerSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  taxNumber: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

OrganizerSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

const Organizer = mongoose.model('Organizer', OrganizerSchema);
module.exports = Organizer;
