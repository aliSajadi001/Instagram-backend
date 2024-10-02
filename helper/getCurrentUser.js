let jwt = require('jsonwebtoken');
const userModel = require('../models/users');
let getCurrentUser = async (req, res) => {
  try {
   
    let token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: 'User not authenticed' });
    } else {
      let decode = await jwt.verify(token, process.env.SECRET_PASS_TOKEN);
      if (!decode) {
        return res.json({ success: false, message: 'Invalid token' });
      } else {
        let user = await userModel.findById(decode.id);
        if (!user) {
          return res.json({ success: false, message: 'The user not found' });
        } else {
          return res.json({
            success: true,
            user: {
              ...user._doc,
              password: undefined,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = getCurrentUser;
