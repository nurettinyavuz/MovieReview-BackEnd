const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  fragmentURL: {
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
  OrganizationKind: {
    type: String,
    enum: ['Film', 'Dizi'],
  },
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
