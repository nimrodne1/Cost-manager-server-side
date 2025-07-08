const express = require('express');
const aboutRouter = express.Router();
const aboutController = require('../controllers/about_controller');

aboutRouter.get('/about', aboutController.getDevelopers);




module.exports = aboutRouter;