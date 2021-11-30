const mongoose = require('mongoose');

// Create schemas
const questionSchema = new mongoose.Schema({
    email: String, 
    username: String,
    title: String, 
    major: String,
    body: String, 
    tags: Array, 
    date_and_time: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false } 
}) 

// Compile these schema into a model --> a class
const Questions = mongoose.model('Questions', questionSchema);



// ************************************************************** Questions **************************************************************
exports.ask_fn = (req, res) => {
    console.log( "req.body: ", req.body);
    const { title, major, body, tag } = req.body; 
    console.log("User " + req.user.email + " just posted a question"); 

    // Validate input
    // Missing a field
    if (title == "" || major == "" || body == "" || tag == "" ) {
        req.session.message_fail = "Missing one or more fields"; 
        return res.redirect('/question'); 
    } 

    async function insertDes() {
        var tag_list = tag.split(","); 
        const question = new Questions({
            email: req.user.email,
            username: "empty",
            title: title, 
            major: major,   
            body: body, 
            tags: tag_list
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

            for (var i = 0; i < ques_list.length; i++) {
                ques_list[i]["date_and_time"] = ques_list[i]["date_and_time"].substring(0, 19);
                for (var j = 0; j < ques_list[i]["tags"].length; j++) {
                    ques_list[i]["tags"][j] = "#" + ques_list[i]["tags"][j]; 
                }
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


exports.populateTags = async (req, res, next) => {
    if (req.user){
        try {
            const question_list = await Questions.find({}); 

            if (!question_list) return next();

            // var string = JSON.stringify(question_list);
            // var ques_list = JSON.parse(string);

            var tags_list = []; 
            for (var i = 0; i < question_list.length; i++) {
                for (var j = 0; j < question_list[i]["tags"].length; j++) {
                    question_list[i]["tags"][j] = "#" + question_list[i]["tags"][j]; 
                }
                tags_list = tags_list.concat(question_list[i]["tags"]); 
            }

            req.tags_list = tags_list; 
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


exports.questionInfo = async (req, res, next) => {
    try {
        const oneQuestion = await Questions.find({_id: req.params.id}); 
        
        var string = JSON.stringify(oneQuestion);
        var instance = JSON.parse(string);

        instance[0]["date_and_time"] = instance[0]["date_and_time"].substring(0, 19);
        for (var j = 0; j < instance[0]["tags"].length; j++) {
            instance[0]["tags"][j] = "#" + instance[0]["tags"][j]; 
        }
        
        req.instance = instance[0]; 
        return next();
    } catch (error) {
        console.log(error);
        return next();
    }
}
