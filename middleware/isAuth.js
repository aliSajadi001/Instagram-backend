let jwt = require('jsonwebtoken');
let isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
        if (!token) {
      return res.json({ success: false, message: 'User not authenticed' });
    } else {
      let decode = await jwt.verify(token, process.env.SECRET_PASS_TOKEN);
      if (!decode) {
        return res.json({ success: false, message: 'Invalid token' });
      } else {
        req.id = decode.id;
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = isAuth;
