const bcrypt = require('bcrypt');
const express = require('express');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');
const User = require('../models/User');


const calculateAverageRating = async (id) => {
  try {
    const movieseriess = (await movieSeries.findOne({ _id:id }))
      .comments;
    let allComment = [];
    let sumRating = 0;
    await Promise.all(
      movieseriess.map(async (commentId, index) => {
        const res = await Comment.findById(commentId);
        sumRating += res.rating;
        allComment.push(res);
      })
    );
    const averageRating = sumRating / movieseriess.length;

    // MovieSeries belgesini alÄ±n ve ortalama puanÄ± kaydedin
    const movieseries = await movieSeries.findOne({ _id:id });
    if (movieseries && sumRating != 0) {
      movieseries.rating = averageRating;
      await movieseries.save();
    }
    else{
      return false
    }

  } catch (error) {
    return error;
  }
};

exports.CreateComment = async (req, res ) => {
  try {
    // KullanÄ±cÄ±nÄ±n kimliÄŸini authorizationToken'dan alÄ±n
    const userId = req.user.userId;
    const movieSeriesId = req.params.movieSeriesId;

    // KullanÄ±cÄ±nÄ±n adÄ±nÄ± da alÄ±n
    const user = await User.findById(userId);
    const userName = user.UserName; // modeldeki kullanÄ±cÄ±nÄ±n adÄ±nÄ± Ã§ekin
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        error: 'KullanÄ±cÄ± bulunamadÄ±',
      });
    }

    const movieseries = await movieSeries.findById(movieSeriesId); //movieseries tüm yorumları çeker
    console.log(movieseries);
    if (!movieseries) {
      return res.status(404).json({
        status: 'fail',
        error: 'Belirtilen film serisi bulunamadÄ±.',
      });
    }

    const movieSeriesName = movieseries.name;

    const { comment, rating } = req.body;

    // KullanÄ±cÄ±dan gelen yÄ±ldÄ±z deÄŸerini kontrol etmek
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'fail',
        error: 'YÄ±ldÄ±z deÄŸeri 1 ile 5 arasÄ±nda olmalÄ±dÄ±r.',
      });
    }

    const createComment = await Comment.create({
      comment: comment,
      createdUserId: userId, // Yorumun kimin tarafÄ±ndan yapÄ±ldÄ±ÄŸÄ±nÄ± belirtin
      userName: userName, // Yorumu yapan kullanÄ±cÄ±nÄ±n adÄ±nÄ± ekleyin
      movieSeriesId: movieSeriesId,
      movieSeriesName: movieSeriesName,
      rating: rating,
    });


    // Mevcut yorumlarÄ± alÄ±p yeni yorumun ObjectId'sini eklemek
    if (Array.isArray(movieseries.comments)) {
      movieseries.comments.push(createComment._id);
    } else {
      movieseries.comments = [createComment._id];
    }
    await movieseries.save();

    // KullanÄ±cÄ± modelini gÃ¼ncelleyin ve yorumun ObjectId'sini ekleyin
    if (Array.isArray(user.comments)) {
      user.comments.push(createComment._id);
    } else {
      user.comments = [createComment._id];
    }
    await user.save();

    await calculateAverageRating(movieSeriesId);

   if(calculateAverageRating(movieSeriesId)){
        res.status(201).json({
        success: true,
        message: 'Comment added successfully.',
        createComment,
      });
   }else{
      return res.status(400).json({
          success: false,
          message: 'Comment could not be added.',
        });
   }


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

    // Yorumu veritabanÄ±ndan bul
    const comment = await Comment.findById(commentId);

    // Yorumu veritabanÄ±ndan sil
    await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        error: 'Comment not found.',
      });
    }
    // Yorumun baÄŸlÄ± olduÄŸu film serisinden kaldÄ±r
    const movieseries = await movieSeries.findOne({ comments: commentId });
    if (movieseries) {
      //Ã–nce CommentId'yi (yani silinecek veriyi) VeritabanÄ±nda filmlerin iÃ§indeki array'dan kaldÄ±rÄ±yoruz
      //sonradan da kaldÄ±rÄ±lmÄ±ÅŸ halini kayÄ±t ediyoruz
      movieseries.comments.pull(commentId);
      await movieseries.save();
    }

    // KullanÄ±cÄ±nÄ±n modelini bul
    const user = await User.findById(comment.createdUserId);

    if (user) {
      // KullanÄ±cÄ±nÄ±n comments dizisinden silinen yorumun ID'sini kaldÄ±r
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

      // KullanÄ±cÄ± modelini gÃ¼ncelle
      await user.save();
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
    const commentId = req.params.commentId; // GÃ¼ncellenecek yorumun ID'sini al
    const updatedCommentData = req.body; // Yeni yorum verilerini al

    // Yorumu veritabanÄ±ndan bul
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      updatedCommentData,
      {
        new: true, // GÃ¼ncellenmiÅŸ yorumu dÃ¶ndÃ¼r
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
      data: comment, // GÃ¼ncellenmiÅŸ yorum verilerini yanÄ±t olarak dÃ¶n
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
    const user = await User.findOne({ _id: req.params.id }); //URL'de ki user'Ä± Ã§ektik
    console.log(user);
    const comments = user.comments; //User'Ä±n iÃ§indeki comments'i Ã§ektik

    if (!user._id) {
      return res.status(404).json({
        status: false,
        message: 'BÃ¶yle bir kullanÄ±cÄ± yok',
      });
    }
    if (!comments) {
      return res.status(404).json({
        status: false,
        message: 'KullanÄ±cÄ±ya ait yorum bulunamadÄ±',
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

//All Comment (Filme gelen yorumlarÄ±n ID'lerini buluyor)
exports.getAllComments = async (req, res) => {
  try {
    const movieId = req.params.id; //hangi film veya dizi iÃ§in yorumlarÄ± Ã§ekeceÄŸimizi belirler
    const movie = await movieSeries.findById(movieId).populate({
      path: 'comments',
      options: { sort: { createdDate: -1 } }, // YorumlarÄ± yaratÄ±lma tarihine gÃ¶re sÄ±rala
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film veya dizi bulunamadÄ±.',
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


exports.TopMovie = async (req, res) => {
  try {
    const topMovies = await movieSeries.find().sort({ rating: -1 }).limit(10);

    res.status(200).json({
      success: true,
      topMovies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Like iÅŸlemi
exports.Like = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    const userId = req.user.userId; // JWT'den Ã§Ä±kartÄ±lan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    // KullanÄ±cÄ±nÄ±n daha Ã¶nce bu yorumu beÄŸenmediÄŸini ve bu yorumu daha Ã¶nce beÄŸenmediyse
    if (!user.likedComments.includes(comment._id)) {
      // Like iÅŸlemini gerÃ§ekleÅŸtir
      await comment.updateOne({ $addToSet: { likes: userId } });

      // KullanÄ±cÄ±nÄ±n "likedComments" listesine bu yorumu ekleyin
      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedComments: comment._id } }
      );

      res.status(200).json('The comment has been liked');
    } else {
      // KullanÄ±cÄ± daha Ã¶nce beÄŸenmiÅŸse, beÄŸeniyi geri al
      await comment.updateOne({ $pull: { likes: userId } });

      // KullanÄ±cÄ±nÄ±n "likedComments" listesinden bu yorumu Ã§Ä±karÄ±n
      await User.updateOne(
        { _id: userId },
        { $pull: { likedComments: comment._id } }
      );

      res.status(200).json('The like has been removed');
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Dislike iÅŸlemi
exports.Dislike = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    const userId = req.user.userId; // JWT'den Ã§Ä±kartÄ±lan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    // KullanÄ±cÄ±nÄ±n daha Ã¶nce bu yorumu beÄŸenmediÄŸini ve bu yorumu daha Ã¶nce beÄŸenmediyse
    if (!user.dislikedComments.includes(comment._id)) {
      // Dislike iÅŸlemini gerÃ§ekleÅŸtir
      await comment.updateOne({ $addToSet: { dislikes: userId } });

      // KullanÄ±cÄ±nÄ±n "dislikedComments" listesine bu yorumu ekleyin
      await User.updateOne(
        { _id: userId },
        { $addToSet: { dislikedComments: comment._id } }
      );

      res.status(200).json('The comment has been disliked');
    } else {
      // KullanÄ±cÄ± daha Ã¶nce dislike yapmÄ±ÅŸsa, dislike'Ä± geri al
      await comment.updateOne({ $pull: { dislikes: userId } });

      // KullanÄ±cÄ±nÄ±n "dislikedComments" listesinden bu yorumu Ã§Ä±karÄ±n
      await User.updateOne(
        { _id: userId },
        { $pull: { dislikedComments: comment._id } }
      );

      res.status(200).json('The dislike has been removed');
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

