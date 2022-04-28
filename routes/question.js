const express = require('express');
const authController = require('../controllers/auth');          // load a module
const questionController = require('../controllers/question')    // load a module
const router = express.Router();

// create a controller that can deal with all the data
// booking
router.post('/ask', authController.isLoggedIn, questionController.ask_fn);
router.post('/submitResponse/id=:_id', authController.isLoggedIn, questionController.answer_fn);

module.exports = router;  

