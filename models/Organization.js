const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  startDate: {
    type:Date,
    required:true
  },
  endDate:{
    type:Date,
    required:true
  },
  category:{
    type:String,
    enum:["Concert","NightClub"],
  },
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
