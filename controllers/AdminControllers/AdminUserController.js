const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const Comment = require('../models/Comment');
const movieSeries = require('../models/movieSeries');

exports.getUser = async(req,res)=>{
    try{

    } catch (error) {
        res.status(400).json({
          status: 'fail',
          error,
        });
      }
}