let express = require('express');
require('dotenv').config();
let cors = require('cors');
const mongodb = require('./DB/dbConfig');
let cookieParser = require('cookie-parser');
const withCredentials = require('./middleware/credentials');
const userRuote = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const chatRoute = require('./routes/chat.route');
const getCurrentUser = require('./helper/getCurrentUser');
const { app, server } = require('./socket/socket');
mongodb();
let corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(withCredentials);
app.use(cookieParser());
app.use(express.json());
/////////user route/////////
app.use('/user', userRuote);
/////////posts route////////
app.use('/post', postRoute);
/////////chats route////////
app.use('/chat', chatRoute);
/////////isAuth/////////////
app.get('/isAuth', getCurrentUser);
server.listen(4030, () => {
  console.log('server is connect');
});
