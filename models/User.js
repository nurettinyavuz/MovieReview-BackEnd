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
    enum: ['user','admin'],
    default: 'user', //otomatik user olarak giriş yapıyor
  },
  skillRank: {
    type: String,
    enum: ['Acemi','Amatör','Tecrübesiz','Yeni Başlayan','Orta Seviye','Deneyim Kazanmış','Yetenekli','İleri Düzey','Usta','Profesyonel'],
    default: 'Acemi', //otomatik user olarak giriş yapıyor
  },
  userScore: {
    type: Number,
    default: 0, // Başlangıç puanı, isteğe bağlı olarak 0 veya başka bir değer olabilir.
  },
  
// "like" yapılan filmleri tutar
  likedComments: [{ 
    type: mongoose.Types.ObjectId, 
    ref: 'Movie' 
  }], 
  
// "dislike" yapılan filmleri tutar
  dislikedComments: [{
    type: mongoose.Types.ObjectId, 
    ref: 'Movie' 
  }], 

});

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
