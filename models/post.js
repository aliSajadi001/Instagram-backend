let mongoose = require('mongoose');
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let post = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: '',
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);
post.plugin(aggregatePaginate)
let postModel = mongoose.model('Post', post);
module.exports = postModel;
