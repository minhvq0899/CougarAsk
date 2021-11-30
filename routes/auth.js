const express = require('express');
const authController = require('../controllers/auth');          // load a module
// const upload = require("../app");
const router = express.Router();


// create a controller that can deal with all the data
// authentication
router.post('/register', authController.register_fn); 
router.post('/login', authController.login_fn);
router.get('/logout', authController.logout_fn);
router.post('/update_name', authController.isLoggedIn, authController.update_name_fn);
// router.post('/upload_profile_pic', authController.isLoggedIn, upload.single("image"), authController.upload_profile_pic); 

module.exports = router; 



