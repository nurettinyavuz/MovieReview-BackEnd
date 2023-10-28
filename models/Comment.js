const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // Yorumun hangi kullanıcıya ait olduğunu belirlemek için User modeline referans
  createdUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  userName: {
    type: String, // Yorum yapan kullanıcının adını burada saklayın
    ref: 'User', 
  },
  movieSeriesId: {
    type: Schema.Types.ObjectId,
    ref: 'movieSeries',
    required: true,
  },  
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  dislikes: {
    type: Array,
    default: [],
  },
});


const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
