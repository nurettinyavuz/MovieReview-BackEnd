const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  UserName: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user','banned', 'admin'],
    default: 'user', //otomatik user olarak giriş yapıyor
  },
  userScore: {
    type: Number,
    default: 0, // Başlangıç puanı, isteğe bağlı olarak 0 veya başka bir değer olabilir.
  },

  //"comments" kullanıcının yaptığı yorumları tutar
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
  ],

  // "like" yapılan filmleri tutar
  likedComments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie',
    },
  ],

  // "dislike" yapılan filmleri tutar
  dislikedComments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie',
    },
  ],

  isBanned: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next(); // Şifre değiştirilmediyse devam et
  }

  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (!update || !update.password) {
    return next();
  }

  bcrypt.hash(update.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    update.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
