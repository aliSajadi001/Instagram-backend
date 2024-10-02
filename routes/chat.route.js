const { CretaeChat, GetAllChat } = require('../controllers/chat');
const isAuth = require('../middleware/isAuth');
let Router = require('express').Router();

Router.post('/create/:id',isAuth, CretaeChat);
Router.get('/get/:id',isAuth, GetAllChat);

module.exports = Router