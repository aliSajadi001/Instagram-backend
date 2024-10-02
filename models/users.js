let mongoose = require('mongoose');

let user = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj4tKuDkquWhDzw6gz98V-FdyQH_2td5t-4dFqwk3q-kFGwCJAjsTou70AXiYdmTiB91c&usqp=CAU',
    },
    bio: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'woman', 'customized'],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { timestamps: true }
);

let userModel = mongoose.model('User', user);
module.exports = userModel;
