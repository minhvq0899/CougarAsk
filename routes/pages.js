const express = require('express');
const authController = require('../controllers/auth');          // load a module
const questionController = require('../controllers/question');   // load a module
const router = express.Router();

// res.render() function is used to render a view
router.get('/', authController.isLoggedIn, questionController.populateQuestions, (req,res) => {
    if (req.user) {
        res.render('landing', {
            user: req.user,
            questions: req.questions
        }); 
    } else {
        res.render('index');
    }
});


router.get('/tags', authController.isLoggedIn, questionController.populateTags, (req,res) => {
    if (req.user) {
        res.render('list_of_tags', {
            user: req.user,
            list_of_tags: req.tags_list
        }); 
    } else {
        res.render('index');
    }
});


router.get('/users', authController.isLoggedIn, authController.populateUsers, (req,res) => {
    if (req.user) {
        res.render('list_of_users', {
            user: req.user,
            list_of_users: req.users_list
        }); 
    } else {
        res.render('index');
    }
});


router.get('/register', (req,res) => {
    if (req.session) {
        res.render('register', {
            message_fail: req.session.message_fail,
            message_success: req.session.message_success
        });
    } else {
        res.render('register'); 
    }
    delete req.session.message_fail;
    delete req.session.message_success;
});


router.get('/login', (req,res) => {
    res.render('login', {
        message: req.session.message
    });
    delete req.session.message; 
});


router.get('/each_question/:id', authController.isLoggedIn,  questionController.questionInfo, (req,res) => {
    if(req.user) {
        res.render('each_question', {
            instance: req.instance
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/settings', authController.isLoggedIn, (req,res) => {
    if (req.user) {
        res.render('settings', {
            user: req.user,
            message_fail: req.session.message_fail,
            message_success: req.session.message_success
        }); 
    } else {
        res.redirect('/login'); 
    }
    delete req.session.message_fail;    
    delete req.session.message_success;
});


router.get('/logout', (req,res) => {
    res.render('logout'); 
});


router.get('/question', authController.isLoggedIn, (req,res) => {
    if (req.user) {
        res.render('question', {
            user: req.user, 
            message_fail: req.session.message_fail,
            message_success: req.session.message_success
        }); 
    } else {
        res.redirect('/login'); 
    }

    delete req.session.message_fail;
    delete req.session.message_success;
});


module.exports = router; 



