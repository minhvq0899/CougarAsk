// const mongoose = require('mongoose');
// const multer = require("multer"); 
// const { GridFsStorage } = require("multer-gridfs-storage"); 
// const Grid = require("gridfs-stream"); 
// const path = require('path'); 
// const fs = require('fs');
// const crypto = require('crypto'); 
// const methodOverride = require('method-override');

// const promise = mongoose.connect('mongodb://localhost/cAsk', { useNewUrlParser: true, useUnifiedTopology: true} ); 
// // const image_conn = mongoose.createConnection("mongodb://localhost/cAsk", { useNewUrlParser: true, useUnifiedTopology: true} ); 

// const conn = mongoose.connection;

// let gfs; 

// conn.once('open', () => {
//     // init stream
//     gfs = Grid(conn, mongoose.mongo);  
//     gfs.collection('uploads'); 
// })

// // Create storage engine
// const storage = new GridFsStorage({
//     url: promise,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
// });

// //const upload = multer({ storage });

// module.exports = multer({ storage });