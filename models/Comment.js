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
  comment: String,
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
