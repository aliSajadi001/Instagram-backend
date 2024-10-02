const {
  SignUp,
  Login,
  Logout,
  SuggesteUsers,
  GetProfile,
  EditProfile,
  FollowAndUnfollow,
  GetStoris,
} = require('../controllers/auth');
const loginValidator = require('../helper/loginValidation');
const signupValidation = require('../helper/signupValidation');
const isAuth = require('../middleware/isAuth');
let Router = require('express').Router();

Router.post('/signup', signupValidation(), SignUp);
Router.post('/login', loginValidator(), Login);
Router.post('/logout', Logout);
Router.get('/suggeste-users', isAuth, SuggesteUsers);
Router.get('/get-profile/:id', isAuth, GetProfile);
Router.post('/edit-profile', isAuth, EditProfile);
Router.post('/follow-unfollow/:id', isAuth, FollowAndUnfollow);
Router.get('/get-storis', isAuth, GetStoris);
module.exports = Router;
