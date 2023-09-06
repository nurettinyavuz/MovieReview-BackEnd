const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    //Yorumların hangi kullanıcıya ait olduğunu belirlemek için referans kullandım
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  film: {
    //Yorumların hangi filme ait olduğunu belirlemek için referans kullandım
    type: Schema.Types.ObjectId,
    ref: 'Film',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
  }
  /* ,
  createdDate: {
    type:Date,
    default:Date.now
  },
  updateDate: {
    type:Date,
  }*/
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
