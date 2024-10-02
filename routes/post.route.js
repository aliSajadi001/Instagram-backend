const {
  Likes,
  Dislikes,
  SavedPosts,
  GetMyPosts,
  AddComment,
  DeletePost,
  CreatePost,
  GetAllPosts,
  GetCommentsPost,
  GetPostProfile,
  GetSavesPosts,

} = require('../controllers/post');
const isAuth = require('../middleware/isAuth');

let Router = require('express').Router();
Router.post('/like/:id', isAuth, Likes);
Router.post('/dislike/:id', isAuth, Dislikes);
Router.post('/create-post', isAuth, CreatePost);
Router.post('/save-post/:id', isAuth, SavedPosts);
Router.get('/get-myPost', isAuth, GetMyPosts);
Router.post('/add-comment/:id', isAuth, AddComment);
Router.post('/delete-post/:id', isAuth, DeletePost);
Router.get('/all-posts', isAuth, GetAllPosts);
Router.get('/getAll-comments/:id', isAuth, GetCommentsPost);
Router.get('/post-profile/:id', isAuth, GetPostProfile);
Router.get('/post-saves/:id', isAuth, GetSavesPosts);


module.exports = Router;
