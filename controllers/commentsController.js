const bcrypt = require('bcrypt');
const express = require('express');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');

//Create Comment
exports.CreateComment = async (req, res) => {
  try {
    const { comment, user, rating } = req.body;

    // Kullanıcıdan gelen yıldız değerini kontrol etmek
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'fail',
        error: 'Star value must be between 1 and 5.',
      });
    }

    const createComment = await Comment.create({
      comment: comment,
      createdBy: user,
      rating:rating,
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

//Get Comment
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//All Comment
exports.getAllComments = async (req, res) => {
  try {
    const movieId = req.params.id;//hangi film veya dizi için yorumları çekeceğimizi belirler
    const movie = await movieSeries.findById(movieId).populate('comments');//Yukarıda çekdiğimiz filmin id'sine ait bilgi ile populate yardımı ile comments'i  çektik 
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film veya dizi bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      comments: movie.comments,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};


exports.calculateAverageRating = async (req,res,filmId) => {
  try {
    const comments = await Comment.find({ film: filmId });

    if (comments.length === 0) {
      return 0; // Yorum yoksa ortalama 0 olur
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;

    return averageRating;
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//Get Comment
exports.LikeOrDislike = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};