const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const nodemailer = require("nodemailer");



// Create schemas
const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String, 
    grad_year: Number, 
    role: String,
    major: String,
    // profile_picture: 
    // {
    //     data: Buffer, 
    //     contentType: String
    // },
    email: String,
    password: String
});
userSchema.methods.generateAuthToken = function() {
    const id = this._id; 
    const first_name = this.first_name; 
    const last_name = this.last_name; 
    const email = this.email; 
    const grad_year = this.grad_year;
    const role = this.role;
    const major = this.major;
    const profile_picture = this.profile_picture;
    const token = jwt.sign( { id: id, fname: first_name, lname: last_name, grad_year: grad_year, email: email, 
                            role: role, major: major, profile_picture: profile_picture }, 
                            process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN} 
    );
    return token; 
}; 

// Compile these schema into a model --> a class
const Users = mongoose.model('Users', userSchema); 








// const storage = new GridFsStorage({
//     url: "mongodb://localhost/cAsk",
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];

//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-any-name-${file.originalname}`;
//             return filename;
//         }

//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-any-name-${file.originalname}`,
//         };
//     },
// });


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });


// ************************************************************** Register, Login and Logout **************************************************************
// A FUNCTION to handle a POST request for register
exports.register_fn = (req, res) => {
    console.log("Register body: ", req.body)
    const { first_name, last_name, role, grad_year, major, email, password, password_confirm } = req.body; 
    // console.log("first_name: ", first_name)
    // console.log(last_name)
    // console.log(role)
    // console.log(grad_year)
    // console.log(major)
    // console.log(email)
    // console.log(password)
    // console.log(password_confirm)

    // Validate input
    // Missing a field
    if (first_name == "" || last_name == "" || grad_year == "" || role == "" || major =="" || email == "" || password == "" || password_confirm == "") {
        req.session.message_fail = "Missing one or more fields"; 
        return res.redirect('/register'); 
    }
    // Check if it's a Clark email
    if (!email.includes("@clarku.edu")) {
        req.session.message_fail = "Must register with a Clark email"; 
        return res.redirect('/register'); 
    }

    // Validation done. Now insert the new account into our database
    async function insertNewAcc() {
        // Encrypt password
        let hashedPassword = await bcrypt.hash(password, 8);
        const newAcc = new Users({
            first_name: first_name,
            last_name: last_name,
            grad_year: grad_year, 
            role: role,
            major: major, 
            profile_picture: null,
            email: email,
            password: hashedPassword
        })

        const result = await newAcc.save(); 
        console.log(result);

        if (result) {
            req.session.message_success = 'User registered'; 
            return res.redirect('/register')
        }   
    }
    
    // Check for duplicate email
    async function getEmail() {
        const email_list = await Users.find({ email: email });
        // console.log('Email list', email_list); 

        if (email_list.length > 0) {
            req.session.message_fail = "Email has already been taken"; 
            return res.redirect('/register'); 
        } else if ( password !== password_confirm ) {
            req.session.message_fail = "Password do not match"; 
            return res.redirect('/register');
        } else {
            insertNewAcc(); 
        }
    }

    getEmail(); 
}



// A FUNCTION to handle a POST request for login
exports.login_fn = async (req, res) => {
    try {
        const { email, password } = req.body; 
        // validate input
        if ( !email || !password ) {
            req.session.message = "Please provide both email and password"; 
            return res.redirect('/login');
        }

        // query db to check if the provided email and password are correct
        const email_list = await Users.find({ email: email });
        // console.log('Email list', email_list); 
        const user = email_list[0]; 

        if ( email_list.length == 0 || !(await bcrypt.compare(password, user.password)) ) {
            req.session.message = "Email or Password is incorrect"; 
            return res.redirect('/login');
        } else {
            // create a token for each user
            const token = user.generateAuthToken(); 

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 
                ), 
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions); 
            // console.log("Token: ", token); 
            if (user.role == "admin") {
                res.status(200).redirect("/admin_page");     
            } else {
                res.status(200).redirect("/"); 
            }
        }
    } catch (error) {
        console.log(error); 
    }
}



// LOGOUT
exports.logout_fn = async (req, res) => {
    console.log("Someone wants to logout...");
    res.cookie('jwt', 'logout_fn', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
    req.session = null;
    console.log("Someone has just logged out");
    res.status(200).redirect('/');
}

    

// Check logged in status
exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.jwt; 
    if (!token) {
        return next(); 
    }; 

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        // console.log( "isLoggedIn: ", req.user); 
        return next(); 
    } 
    catch (ex) {
        return next();
    }
}






// ************************************************************** Setting: Update name, email, password, etc **************************************************************
exports.update_name_fn = async (req, res) => {
    console.log( "req.body: ", req.body ); 

    try {     
        const result = await Users.updateOne( {email: req.user.email}, {
            $set: {
                "first_name": req.body.newFName,
                "last_name": req.body.newLName
            }
        }, {upsert: false} )
        console.log(result); 
        req.session.message_success = "Name Updated"; 
        return res.redirect('/settings');
    } catch (error) {
        console.log(error);
        req.session.message_fail = "Update fail. Please try again!"; 
        return res.redirect('/settings');
    }
}


exports.upload_profile_pic = async (req, res) => {
    try {     
        // const result = await Users.updateOne( {email: req.user.email}, {
        //     $set: {
        //         "profile_picture": { data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        //                             contentType: 'image/png'}
        //     }
        // }, {upsert: false} )
        // console.log(result); 
        req.session.message_success = "Profile Picture Updated"; 
        return res.redirect('/settings');
    } catch (error) {
        console.log(error);
        req.session.message_fail = "Update fail. Please try again!"; 
        return res.redirect('/settings');
    }
}








// ************************************************************** Populate Users **************************************************************
exports.populateUsers = async (req, res, next) => {
    if (req.user){
        try {
            const user_list = await Users.find({}, {password:0}); 

            if (!user_list) return next();

            // var string = JSON.stringify(user_list);
            // var user_list_final = JSON.parse(string);

            // console.log(user_list); 

            req.users_list = user_list; 
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } 
    else {
        return next();
    }
}






// ************************************************************** Give one user info **************************************************************
exports.userProfileInfo = async (req, res, next) => {
    try {
        const instance = await Users.find({_id: req.params.userid}, {password:0}); 
        
        // var string = JSON.stringify(oneQuestion);
        // var instance = JSON.parse(string);
        
        req.instance = instance[0]; 
        return next();
    } catch (error) {
        console.log(error);
        return next();
    }
}












