const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user_controller');

userRouter.post('/users/:id', userController.createNewUser);
userRouter.get('/users/:id',userController.getUserDetails);

module.exports = userRouter;