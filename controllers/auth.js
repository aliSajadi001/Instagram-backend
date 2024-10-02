const { validationResult } = require('express-validator');
const userModel = require('../models/users');
let bcryptjs = require('bcryptjs');
let jwt = require('jsonwebtoken');
////////////////////Signup////////////////////
let SignUp = async (req, res) => {
  try {
    let { email, password, userName } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    } else {
      let hash = await bcryptjs.hash(password, 10);
      await new userModel({
        password: hash,
        userName,
        email,
      }).save();
      return res.json({ success: true, message: 'Create user successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};
////////////////////Login////////////////////
let Login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    } else {
      let user = await userModel.findOne({ email });
      let isMatchPass = await bcryptjs.compare(password, user.password);
      if (!isMatchPass) {
        return res.json({
          success: false,
          message: 'the Password is not match',
        });
      } else {
        let token = await jwt.sign(
          { id: user._id },
          process.env.SECRET_PASS_TOKEN,
          { expiresIn: '1d' }
        );
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        return res.json({
          success: true,
          message: 'Login successfully',
          user: { ...user._doc, password: undefined },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////Logout////////////////////
let Logout = (_, res) => {
  try {
    return res.cookie('token', '', { expiresIn: 0 }).json({
      success: true,
      message: 'Logout successfukky',
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////get Profile////////////////////
let GetProfile = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.id);
    if (!user) {
      return res
        .json({ success: false, message: 'User not found' })
        .select('-password');
    } else {
      return res.json({ success: true, user });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////edit Profile errrrrrrrrrr////////////////////
let EditProfile = async (req, res) => {
  try {
    let { userName, bio, gender, profile } = req.body;
    let user = await userModel.findById(req.id);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    } else {
      if (userName) user.userName = userName;
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profile) user.profile = profile;
      await user.save();
      return res.json({
        success: true,
        message: 'User update successfully',
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////edit Profile////////////////////
let SuggesteUsers = async (req, res) => {
  try {
    let users = await userModel.find(
      { _id: { $ne: req.id } },
      'userName _id profile'
    );
    if (!users) {
      return res.json({ success: false, message: 'Users not found' });
    } else {
      return res.json({ success: true, users });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////edit Profile////////////////////
let FollowAndUnfollow = async (req, res) => {
  try {
    let follower = req.id;
    let followed = req.params.id;
    if (req.id === req.params.id) {
      return res.json({
        success: false,
        message: 'You can not follow or unfollow yourself',
      });
    } else {
      let currentUser = await userModel.findById(follower);
      let targetUser = await userModel.findById(followed);
      if (!targetUser) {
        return res.json({
          success: false,
          message: 'Ther is not such person',
          followe: true,
        });
      } else {
        let isFollowd = currentUser.following.includes(followed);
        if (isFollowd) {
          await Promise.all([
            userModel.updateOne(
              { _id: follower },
              { $pull: { following: followed } }
            ),
            userModel.updateOne(
              { _id: followed },
              { $pull: { followers: follower } }
            ),
          ]);
          return res.json({
            success: true,
            message: 'Unfollowd',
            unFollowe: true,
          });
        } else {
          await Promise.all([
            userModel.updateOne(
              { _id: follower },
              { $push: { following: followed } }
            ),
            userModel.updateOne(
              { _id: followed },
              { $push: { followers: follower } }
            ),
          ]);
          return res.json({ success: true, message: 'Followd' });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

///////////////////get Storis//////////////
let GetStoris = async (req, res) => {
  try {
    let follower = await userModel.findById(req.id).populate('following');
    if (follower) {
      return res.json({ success: true, follower: follower.following });
    }
    console.log(follower);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

module.exports = {
  SignUp,
  Login,
  Logout,
  GetStoris,
  GetProfile,
  EditProfile,
  SuggesteUsers,
  FollowAndUnfollow,
};
