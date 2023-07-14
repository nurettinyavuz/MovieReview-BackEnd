const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Organization = require('../models/Organization');



exports.createOrganizer = async (req, res) => {
    try {
      const organizer = await Organizer.create(req.body);
      res.status(201).json({
        status: 'success',
        organizer,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  
  exports.createOrganization = async (req, res) => {
    try {
      const organization = await Organization.create(req.body);
      res.status(201).json({
        status: 'success',
        organization,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };