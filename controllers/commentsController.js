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

    // MovieSeries belgesini alın ve ortalama puanı kaydedin
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
    
    if(user.role == 'banned'){
      return res.status(400).json({
        status: 'fail',
        error: 'Kullanıcı yasaklandı.',
      });
    }

    const movieseries = await movieSeries.findById(movieSeriesId); //movieseries tüm yorumları çeker
    if (!movieseries) {
      return res.status(404).json({
        status: 'fail',
        error: 'Belirtilen film serisi bulunamadı.',
      });
    }

    const movieSeriesName = movieseries.name;
    const moviePhoto = movieseries.moviePhoto; // Film serisinin fotoğraf stringini alın
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
      createdUserId: userId,
      userName: userName,
      movieSeriesId: movieSeriesId,
      movieSeriesName: movieSeriesName,
      rating: rating,
      moviePhoto: moviePhoto, // Yorum modeline film serisi fotoğrafını ekleyin
    });

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

    await calculateAverageRating(movieSeriesId);

    if (calculateAverageRating(movieSeriesId)) {
      res.status(201).json({
        success: true,
        message: 'Yorum başarıyla eklendi.',
        createComment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Yorum eklenemedi.',
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

   if(calculateAverageRating(movieseries)){
        res.status(201).json({
        success: true,
        message: 'Comment deleted successfully.',
      });
   }else{
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
    const movieId = req.params.id;//hangi film veya dizi için yorumları çekeceğimizi belirler
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

// Like işlemi
exports.Like = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    const userId = req.user.userId; // JWT'den çıkartılan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    if(user.role == 'banned'){
      return res.status(400).json({
        status: 'fail',
        error: 'Kullanıcı yasaklandı.',
      });
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
      // Kullanıcı daha önce beğenmişse, beğeniyi geri al
      await comment.updateOne({ $pull: { likes: userId } });

      // Kullanıcının "likedComments" listesinden bu yorumu çıkarın
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

// Dislike işlemi
exports.Dislike = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    const userId = req.user.userId;// JWT'den çıkartılan user id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    if(user.role == 'banned'){
      return res.status(400).json({
        status: 'fail',
        error: 'Kullanıcı yasaklandı.',
      });
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
      // Kullanıcı daha önce dislike yapmışsa, dislike'ı geri al
      await comment.updateOne({ $pull: { dislikes: userId } });

      // Kullanıcının "dislikedComments" listesinden bu yorumu çıkarın
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

