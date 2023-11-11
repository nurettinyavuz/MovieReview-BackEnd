const bcrypt = require('bcrypt');
const express = require('express');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.CreateComment = async (req, res) => {
  try {
    // Kullanıcının kimliğini authorizationToken'dan alın
    const userId = req.user.userId;
    const movieSeriesId = req.params.movieSeriesId;

    // Kullanıcının adını da alın
    const user = await User.findById(userId);
    const userName = user.UserName; // modeldeki kullanıcının adını çekin
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        error: 'Kullanıcı bulunamadı',
      });
    }

    const movieseries = await movieSeries.findById(movieSeriesId); //movieseries tüm yorumları çeker
    console.log(movieseries);
    if (!movieseries) {
      return res.status(404).json({
        status: 'fail',
        error: 'Belirtilen film serisi bulunamadı.',
      });
    }

    const movieSeriesName = movieseries.name;

    const { comment, rating } = req.body;

    // Kullanıcıdan gelen yıldız değerini kontrol etmek
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'fail',
        error: 'Yıldız değeri 1 ile 5 arasında olmalıdır.',
      });
    }

    const createComment = await Comment.create({
      comment: comment,
      createdUserId: userId, // Yorumun kimin tarafından yapıldığını belirtin
      userName: userName, // Yorumu yapan kullanıcının adını ekleyin
      movieSeriesId: movieSeriesId,
      movieSeriesName: movieSeriesName,
      rating: rating,
    });
    console.log(userName);
    // console.log(filmId);

    // Mevcut yorumları alıp yeni yorumun ObjectId'sini eklemek
    if (Array.isArray(movieseries.comments)) {
      movieseries.comments.push(createComment._id);
    } else {
      movieseries.comments = [createComment._id];
    }
    await movieseries.save();

    // Kullanıcı modelini güncelleyin ve yorumun ObjectId'sini ekleyin
    if (Array.isArray(user.comments)) {
      user.comments.push(createComment._id);
    } else {
      user.comments = [createComment._id];
    }
    await user.save();

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

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId; // Güncellenecek yorumun ID'sini al
    const updatedCommentData = req.body; // Yeni yorum verilerini al

    // Yorumu veritabanından bul
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      updatedCommentData,
      {
        new: true, // Güncellenmiş yorumu döndür
      }
    );

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        error: 'Comment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully.',
      data: comment, // Güncellenmiş yorum verilerini yanıt olarak dön
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//Get User's Comment
exports.getUserComment = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }); //URL'de ki user'ı çektik
    console.log(user);
    const comments = user.comments; //User'ın içindeki comments'i çektik

    if (!user._id) {
      return res.status(404).json({
        status: false,
        message: 'Böyle bir kullanıcı yok',
      });
    }
    if (!comments) {
      return res.status(404).json({
        status: false,
        message: 'Kullanıcıya ait yorum bulunamadı',
      });
    }

    res.status(200).json({
      status: true,
      comments: user.comments,
    });
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
      status: true,
      comment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//All Comment (Filme gelen yorumların ID'lerini buluyor)
exports.getAllComments = async (req, res) => {
  try {
    const movieId = req.params.id; //hangi film veya dizi için yorumları çekeceğimizi belirler
    const movie = await movieSeries.findById(movieId).populate({
      path: 'comments',
      options: { sort: { createdDate: -1 } }, // Yorumları yaratılma tarihine göre sırala
    });

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

exports.calculateAverageRating = async (req, res) => {
  try {
    const movieseriess = (await movieSeries.findOne({ _id: req.params.id }))
      .comments;
    let allComment = [];
    let sumRating = 0;
    await Promise.all(
      movieseriess.map(async (commentId, index) => {
        const res = await Comment.findById(commentId);
         sumRating+=res.rating;
        allComment.push(res);
      })
    );
    console.log(allComment);
    const averageRating = sumRating / movieseriess .length;

    if (sumRating == 0) {
      return res.status(200).json({
        averageRating: 0,
      });
    }

    // MovieSeries belgesini alın ve ortalama puanı kaydedin
    const movieseries = await movieSeries.findOne({ _id: req.params.id });
    if (movieseries) {
      movieseries.rating = averageRating;
      await movieseries.save();
    }

    res.status(200).json({
      status: true,
      averageRating,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}; 

// Like işlemi
exports.Like = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    const userId = req.user.userId; // JWT'den çıkartılan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    // Kullanıcının daha önce bu yorumu beğenmediğini ve bu yorumu daha önce beğenmediyse
    if (!user.likedComments.includes(comment._id)) {
      // Like işlemini gerçekleştir
      await comment.updateOne({ $addToSet: { likes: userId } });

      // Kullanıcının "likedComments" listesine bu yorumu ekleyin
      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedComments: comment._id } }
      );

      res.status(200).json('The comment has been liked');
    } else {
      res.status(400).json('You have already liked this comment');
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Dislike işlemi
exports.Dislike = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });

    // authenticateToken middleware'i kullanıcı bilgilerini req.user'a ekledi.
    const userId = req.user.userId; // JWT'den çıkartılan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    // Kullanıcının daha önce bu yorumu beğenmediğini ve bu yorumu daha önce beğenmediyse
    if (!user.dislikedComments.includes(comment._id)) {
      // Dislike işlemini gerçekleştir
      await comment.updateOne({ $addToSet: { dislikes: userId } });

      // Kullanıcının "dislikedComments" listesine bu yorumu ekleyin
      await User.updateOne(
        { _id: userId },
        { $addToSet: { dislikedComments: comment._id } }
      );

      res.status(200).json('The comment has been disliked');
    } else {
      res.status(400).json('You have already disliked this comment');
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};
