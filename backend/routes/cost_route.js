const express = require('express');
const costRouter = express.Router();
const costController = require('../controllers/cost_controller');

costRouter.post('/add', costController.addCost);
costRouter.get('/report', costController.getReport);




module.exports = costRouter;