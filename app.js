const express = require("express");
const path = require('path'); 
const mongoose = require('mongoose')
const dotenv = require('dotenv'); 
const cookieParser = require('cookie-parser'); 
const rateLimit = require('./middleware/rateLimiter'); 
var session = require('cookie-session');
const methodOverride = require('method-override');
// -------------------------------------------------------------
const multer = require("multer"); 
const { GridFsStorage } = require("multer-gridfs-storage"); 
const Grid = require("gridfs-stream"); 
const fs = require('fs');
const crypto = require('crypto'); 
// -------------------------------------------------------------
dotenv.config({ path: './.env'}); 

const app = express(); 

// Connect to a Database
const promise = mongoose.connect('mongodb://localhost/cAsk', { useNewUrlParser: true, useUnifiedTopology: true} )
    .then( () => console.log('Connected to MongoDB...') )
    .catch(err => console.log('Could not connect to MongoDB...', err))

// front end files
const publicDirectory = path.join(__dirname, './public'); 
// make sure express is actually using this directory
app.use(express.static(publicDirectory));
app.use(methodOverride('_method'));

// parse URL-encoded bodies (as sent by HTML forms)
// make sure you can grab data from any form
app.use(express.urlencoded({ extended: false})); 
// Parse JSON bodies(as sent by API clients)
// make sure the value we grabbed from the form, it comes in JSON
app.use(express.json()); 
app.use(cookieParser()); 

app.set('view engine', 'hbs'); 

// Rate limit: allows students to book maximum 3 rides/ 30 minutes
// app.use(rateLimit.rateLimiterUsingThirdParty); 
 



const conn = mongoose.connection;

let gfs; 

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn, mongoose.mongo);  
    gfs.collection('uploads'); 
})

// Create storage engine
const storage = new GridFsStorage({
    url: promise,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});

const upload = multer({ storage });

// module.exports = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/settings');
});


// Cookie session
app.use(session({
    secret: process.env.COOKIE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

// define routes
app.use('/', require('./routes/pages')); 
app.use('/auth', require('./routes/auth')); 
app.use('/question', require('./routes/question')); 

app.listen(5000, () => {
    console.log("Server started on Port 5000"); 
});


