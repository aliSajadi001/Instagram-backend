const commentModel = require('../models/comment');
const postModel = require('../models/post');
const userModel = require('../models/users');
/////////////////////////create post ////////////////////////////
let CreatePost = async (req, res) => {
  try {
    let { caption, image } = req.body;
    if (!caption && !image) {
      return res.json({
        success: false,
        message: 'Ther must be a caption or image ',
      });
    } else {
      //create post//
      let post = await postModel({ image, createBy: req.id, caption }).save();
      //Add postId to user//
      let user = await userModel.findById(req.id);
      user.post.push(post._id);
      await user.save();
      await post.populate({ path: 'createBy', select: '-password' });
      return res.json({ success: true, message: 'New post created', post });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Get all post ////////////////////////////
let GetAllPosts = async (req, res) => {
  try {
    let allPostes = await postModel
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'createBy', select: 'userName _id profile' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'createBy',
          sort: { createdAt: -1 },
          select: 'userName profile',
        },
      });
    return res.json({ success: true, allPostes });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Get my posts ////////////////////////////
let GetMyPosts = async (req, res) => {
  try {
    let posts = await postModel
      .find({ createBy: req.id })
      .sort({ createdAt: -1 })
      .populate({ path: 'createBy', select: 'userName _id profile' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: { path: 'createBy', select: 'userName _id profile' },
      });
    return res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Like postes ////////////////////////////
let Likes = async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    } else {
      await post.updateOne({ $addToSet: { likes: req.id } });
      await post.save();
      return res.json({ success: true, message: 'Post liked' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Dislike postes ////////////////////////////
let Dislikes = async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    } else {
      await post.updateOne({ $pull: { likes: req.id } });
      await post.save();
      return res.json({ success: true, message: 'Post disliked' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
let AddComment = async (req, res) => {
  try {
    let { text } = req.body;
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    } else {
      let comment = await commentModel.create({
        text,
        createBy: req.id,
        postId: post._id,
      });

      post.comments.push(comment._id);
      let newComment = await commentModel.findById(comment._id).populate({
        path: 'createBy',
        select: 'userName , _id , profile',
      });
      await post.save();
      return res.json({ success: true, message: 'Post created', newComment });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Like postes ////////////////////////////
let GetCommentsPost = async (req, res) => {
  try {
    let id = req.params.id;
    let post = await postModel
      .findById(id)
      .populate({ path: 'createBy', select: '_id profile userName' });
    let comment = await commentModel
      .find({ postId: id })
      .sort({ createdAt: -1 })
      .populate({ path: 'createBy', select: 'userName profile _id' });
    if (comment) {
      return res.json({ success: true, comment, post });
    } else {
      return res.json({ success: false, message: 'Comments not found' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Like postes ////////////////////////////
let DeletePost = async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    } else {
      if (post.createBy._id.toString() !== req.id) {
        return res.json({ success: false, message: 'The post is not yours' });
      } else {
        await postModel.findByIdAndDelete(req.params.id);
        let user = await userModel.findOne({ _id: req.id });
        user.post = user.post.filter((p) => p.toString() !== req.params.id);
        await user.save();
        await commentModel.deleteMany({
          postId: req.params.id,
        });
        return res.json({ success: true, message: 'Delete post sucessfully' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
/////////////////////////Like postes ////////////////////////////
let SavedPosts = async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    } else {
      let currUser = await userModel.findById(req.id);
      if (currUser.saves.toString().includes(post._id.toString())) {
        currUser.saves = currUser.saves.filter(
          (save) => save.toString() !== post._id.toString()
        );
        await currUser.save();
        return res.json({ success: true, message: 'Removed from storage' });
      } else {
        await currUser.updateOne({
          $addToSet: { saves: post._id },
        });
        await currUser.save();
        return res.json({ success: true, message: 'Post saved' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

let GetPostProfile = async (req, res) => {
  try {
    let posts = await postModel.find({ createBy: req.params.id });
    if (posts) {
      return res.json({ success: true, posts });
    } else {
      return res.json({
        success: false,
        message: 'Posts not found',
        posts: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
let GetSavesPosts = async (req, res) => {
  console.log(req.params.id);
  try {
    let posts = await userModel
      .findById(req.params.id)
      .populate({ path: 'saves', select: 'image _id ' });
    if (posts) {
      return res.json({ success: true, posts: posts.saves });
    } else {
      return res.json({
        success: false,
        message: 'Save lists is empty',
        posts: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
module.exports = {
  Likes,
  Dislikes,
  SavedPosts,
  GetMyPosts,
  AddComment,
  DeletePost,
  CreatePost,
  GetAllPosts,
  GetSavesPosts,
  GetPostProfile,
  GetCommentsPost,
};
