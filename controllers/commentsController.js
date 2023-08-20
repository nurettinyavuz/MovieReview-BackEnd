const bcrypt = require('bcrypt');
const express = require('express');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');

//Create Comment
exports.CreateComment = async (req, res) => {
  try {
    const { content, userId, star } = req.body;

    // Kullanıcıdan gelen yıldız değerini kontrol etmek
    if (star < 1 || star > 5) {
      return res.status(400).json({
        status: 'fail',
        error: 'Star value must be between 1 and 5.',
      });
    }

    const createComment = await Comment.create({
      comment: content,
      createdBy: userId,
      star:star,
    });

    const movieseries = await movieSeries.findOne({ _id: req.params.id });
    if (!movieseries) {
      return res.status(404).json({
        status: 'fail',
        error: 'Film series not found.',
      });
    }

    // Mevcut yorumları alıp yeni yorumun ObjectId'sini eklemek
    if (Array.isArray(movieseries.comments)) {
      //Dizi olup olmadığını kontrol eder
      movieseries.comments.push(createComment._id); //Dizi ise dizinin sonuna ekler
    } else {
      //bir dizi değilse (yani daha önce hiç yorum eklenmemişse)
      movieseries.comments = [createComment._id];
    }

    await movieseries.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      createComment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//Delete Comment
exports.deleteComment = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
