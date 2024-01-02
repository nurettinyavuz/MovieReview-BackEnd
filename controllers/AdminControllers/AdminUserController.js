const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../../models/User');
const movieSeries = require('../../models/movieSeries');
const Comment = require('../../models/Comment');

exports.bannedUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Kullanıcı bulunamadı.',
      });
    }

    if (user.isBanned === false) {
      user.role = 'banned';
      user.isBanned = true;
    } else {
      user.role = 'user';
      user.isBanned = false;
    }

    await user.save();

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
