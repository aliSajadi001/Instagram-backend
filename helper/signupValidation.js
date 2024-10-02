let { body } = require('express-validator');
const userModel = require('../models/users');

let signupValidation = () => {
  return [
    body('userName').isLength({ min: 3 }).withMessage('UserName is required'),
    body('email')
      .isLength({ min: 3 })
      .isEmail()
      .withMessage('Email is required')
      .custom(async (value) => {
        return userModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email already existe');
          }
        });
      }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password is required and must be at last 8 characters'),
  ];
};

module.exports = signupValidation;
