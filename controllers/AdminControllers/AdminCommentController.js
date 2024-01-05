const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../../models/User');
const movieSeries = require('../../models/movieSeries');
const Comment = require('../../models/Comment');

// Delete Comment
exports.AdminDeletedComment = async (req, res) => {
  try {
    const users = req.user.userId;

    if (users.role !== 'admin') {
      return res.status(400).json({
        status: 'fail',
        error: 'Bu işlem için yetkiniz yok',
      });
    }

    // Silinecek yorumun ID'sini al
    const commentId = req.params.commentId;

    // Yorumu veritabanından bul
    const comment = await Comment.findById(commentId);

    // Yorumu veritabanından sil
    await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        error: 'Comment not found.',
      });
    }
    // Yorumun bağlı olduğu film serisinden kaldır
    const movieseries = await movieSeries.findOne({ comments: commentId });
    if (movieseries) {
      //Önce CommentId'yi (yani silinecek veriyi) Veritabanında filmlerin içindeki array'dan kaldırıyoruz
      //sonradan da kaldırılmış halini kayıt ediyoruz
      movieseries.comments.pull(commentId);
      await movieseries.save();
    }

    // Kullanıcının modelini bul
    const user = await User.findById(comment.createdUserId);

    if (user) {
      // Kullanıcının comments dizisinden silinen yorumun ID'sini kaldır
      user.comments = user.comments.filter(
        (userCommentId) => userCommentId.toString() !== commentId.toString()
      );

      user.likedComments = user.likedComments.filter(
        (likedCommentId) => likedCommentId.toString() !== commentId.toString()
      );
      user.dislikedComments = user.dislikedComments.filter(
        (dislikedCommentId) =>
          dislikedCommentId.toString() !== commentId.toString()
      );

      // Kullanıcı modelini güncelle
      await user.save();
    }

    await calculateAverageRating(movieseries);

    if (calculateAverageRating(movieseries)) {
      res.status(201).json({
        success: true,
        message: 'Comment deleted successfully.',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Comment could not be deleted.',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
