const mongoose = require('mongoose');

// Create schemas
const questionSchema = new mongoose.Schema({
    email: String, 
    username: String,
    title: String, 
    major: String,
    body: String, 
    tags: String, 
    date_and_time: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false } 
}) 

// Compile these schema into a model --> a class
const Questions = mongoose.model('Questions', questionSchema);



// ************************************************************** Booking Page **************************************************************
exports.ask_fn = (req, res) => {
    console.log( "req.body: ", req.body);
    const { title, major, body, tags } = req.body; 
    console.log("User " + req.user.email + " just posted a question"); 

    // Validate input
    // Missing a field
    if (title == "" || major == "" || body == "" || tags == "" ) {
        req.session.message_fail = "Missing one or more fields"; 
        return res.redirect('/question'); 
    } 

    async function insertDes() {
        const question = new Questions({
            email: req.user.email,
            username: "empty",
            title: title, 
            major: major,
            body: body, 
            tags: tags
        })

        const result = await question.save(); 
        // console.log( "result: ", result);
        if (result) {
            req.session.message_success = "Successful!"; 
            return res.redirect('/question'); 
        } else {
            req.session.message_fail = "Unsuccessful! Please try again!"; 
            return res.redirect('/question'); 
        }
    }

    insertDes();
}


exports.populateQuestions = async (req, res, next) => {
    if (req.user){
        try {
            const question_list = await Questions.find({}); 

            if (!question_list) return next();

            var string = JSON.stringify(question_list);
            var ques_list = JSON.parse(string);

            for (var i = 0; i < ques_list.length; i++){
                ques_list[i]["date_and_time"] = ques_list[i]["date_and_time"].substring(0, 19);
            }

            req.questions = ques_list; 
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


// exports.reservationInfo = async (req, res, next) => {
//     try {
//         const reservationObj = await Bookings.find({_id: req.params.id}); 
//         bookingDebugger("controller: ", reservationObj); 

//         var string = JSON.stringify(reservationObj);
//         var instance = JSON.parse(string);

//         instance[0]["date_and_time"] = instance[0]["date_and_time"].substring(0, 19);
        
//         req.instance = instance[0]; 
//         return next();
//     } catch (error) {
//         bookingDebugger(error);
//         return next();
//     }
// }
