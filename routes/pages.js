const express = require('express');
const authController = require('../controllers/auth');          // load a module
const questionController = require('../controllers/question');   // load a module
const router = express.Router();

// res.render() function is used to render a view
router.get('/', authController.isLoggedIn, questionController.populateQuestions, (req,res) => {
    if (req.user) {
        console.log(req.questions)
        res.render('index', {
            user: req.user,
            questions: req.questions
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


//only go to Booking listings if logged in
// router.get('/admin_page', authController.isLoggedIn, bookingController.populateBookings, (req,res) => {
//     if(req.user) {
//         if (req.user.role == "admin") {
//             res.render('admin_page', {
//                 user: req.user,
//                 reservations: req.reservations
//             });
//         } 
//         else {
//             res.redirect('/login');
//         }
//     }
//     else {
//         res.redirect('/login');
//     }
// });

// router.get('/each_reservation/:id', authController.isLoggedIn, bookingController.reservationInfo, (req,res) => {
//     if(req.user && req.user.role == "admin") {
//         if(req.instance) {
//             console.log("In Pages: ", req.instance); 
//             res.render('each_reservation', {
//                 instance: req.instance
//             });
//         } else {
//             res.redirect('/admin_page');
//         }
//     } else {
//         res.redirect('/login');
//     }
// });


router.get('/settings', authController.isLoggedIn, (req,res) => {
    if (req.user) {
        console.log(req.user); 
        console.log( "user.fname: ", req.user.fname); 
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



