const mongoose = require('mongoose');

// Create schemas
const questionSchema = new mongoose.Schema({
    fname: String, 
    lname: String,
    title: String, 
    major: String,
    body: String, 
    tags: Array, 
    date_and_time: { type: String, default: new Date().toString() } , 
    upvote: { type: Number, default: 0 },
    resolved: { type: Boolean, default: false } 
}) 

// Compile these schema into a model --> a class
const Questions = mongoose.model('Questions', questionSchema);


/* Content:
    1. ask_fn
    2. populateQuestions
    3. populateQuestionsWithTag
    4. populateTags
    5. questionInfo
*/



// ************************************************************** Questions **************************************************************
exports.ask_fn = (req, res) => {
    console.log( "req.body: ", req.body);
    const { title, major, body, tag } = req.body; 

    // Validate input
    // Missing a field
    if (title == "" || major == "" || body == "" || tag == "" ) {
        req.session.message_fail = "Missing one or more fields"; 
        return res.redirect('/question'); 
    } 

    async function insertQuestion() {
        var tag_list = tag.split(","); 
        for (var i = 0; i < tag_list.length; i++) {
            tag_list[i] = tag_list[i].trim().toLowerCase(); 
            console.log(tag_list[i] + " has length of " + tag_list[i].length); 
        }
        const question = new Questions({
            fname: req.user.fname,
            lname: req.user.lname,
            title: title, 
            major: major,   
            body: body, 
            tags: tag_list
        })

        const result = await question.save(); 
        // console.log( "result: ", result);
        if (result) {
            req.session.message_success = "Successful!"; 
            console.log("User " + req.user.email + " just posted a question"); 
            return res.redirect('/question'); 
        } else {
            req.session.message_fail = "Unsuccessful! Please try again!"; 
            return res.redirect('/question'); 
        }
    }

    insertQuestion();
}


exports.populateQuestions = async (req, res, next) => {
    var month_dict = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}; 

    if (req.user){
        var now = new Date().toString().split(" "); 
        // console.log("now: ", now); 
        var month_now = month_dict[now[1]];
        var day_now = now[2];
        var year_now = now[3];
        var now_date_format = new Date(month_now + "/" + day_now + "/" + year_now); 
        
        try {
            const ques_list = await Questions.find({}); 

            if (!ques_list) return next();

            // var string = JSON.stringify(question_list);
            // var ques_list = JSON.parse(string);

            for (var i = 0; i < ques_list.length; i++) {
                // For Date and Time
                var question_time = ques_list[i]["date_and_time"].split(" "); 
                // console.log("question_time: ", question_time); 
                var month_ques = month_dict[question_time[1]];
                var day_ques = question_time[2];
                var year_ques = question_time[3];
                var question_date_format = new Date(month_ques + "/" + day_ques + "/" + year_ques); 

                var diffDays = parseInt((now_date_format - question_date_format) / (1000 * 60 * 60 * 24)); //gives day difference 
                // console.log("diffDays: ", diffDays); 

                if (diffDays == 0) {
                    var hour_now =  parseInt(now[4].substring(0, 2));
                    var minute_now =  parseInt(now[4].substring(3, 5));
                    var hour_ques =  parseInt(question_time[4].substring(0, 2));
                    var minute_ques =  parseInt(question_time[4].substring(3, 5));
                    var diffHour = Math.max(0, hour_now - hour_ques - 1) // * 60 + minute_now + (60-minute_ques); 
                    // console.log("diffHour: ", diffHour); 
                    
                    if (diffHour == 0) {
                        if (hour_ques == hour_now) {
                            var diffMinute = minute_now - minute_ques; 
                            ques_list[i]["date_and_time"] = diffMinute.toString() + " minutes ago"; 
                        } else {
                            var diffMinute = minute_now + (60-minute_ques); 
                            if (diffMinute < 60) {
                                ques_list[i]["date_and_time"] = diffMinute.toString() + " minutes ago"; 
                            } else {
                                ques_list[i]["date_and_time"] = "an hour ago";     
                            }
                        }
                    } else {
                        if (diffHour < 2) {
                            ques_list[i]["date_and_time"] = "an hour ago"; 
                        } else {
                            ques_list[i]["date_and_time"] = diffHour.toString() + " hours ago"; 
                        }
                    }
                } else if (diffDays == 1) {
                    ques_list[i]["date_and_time"] = "Yesterday"; 
                } else if (1 < diffDays && diffDays < 8) {
                    ques_list[i]["date_and_time"] = diffDays.toString() + " days ago"; 
                } else {
                    ques_list[i]["date_and_time"] = question_time[1] + " " + day_ques + ", " + year_ques; 
                }

                // For Tags
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


exports.populateQuestionsWithTag = async (req, res, next) => {
    req.main_tag = req.params.tag; 
    var month_dict = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}; 

    if (req.user){
        var now = new Date().toString().split(" "); 
        // console.log("now: ", now); 
        var month_now = month_dict[now[1]];
        var day_now = now[2];
        var year_now = now[3];
        var now_date_format = new Date(month_now + "/" + day_now + "/" + year_now); 
        
        try {
            const ques_list = await Questions.find({ tags: req.params.tag }); 

            if (!ques_list) return next();

            // var string = JSON.stringify(question_list);
            // var ques_list = JSON.parse(string);

            for (var i = 0; i < ques_list.length; i++) {
                // For Date and Time
                var question_time = ques_list[i]["date_and_time"].split(" "); 
                // console.log("question_time: ", question_time); 
                var month_ques = month_dict[question_time[1]];
                var day_ques = question_time[2];
                var year_ques = question_time[3];
                var question_date_format = new Date(month_ques + "/" + day_ques + "/" + year_ques); 

                var diffDays = parseInt((now_date_format - question_date_format) / (1000 * 60 * 60 * 24)); //gives day difference 
                // console.log("diffDays: ", diffDays); 

                if (diffDays == 0) {
                    var hour_now =  parseInt(now[4].substring(0, 2));
                    var minute_now =  parseInt(now[4].substring(3, 5));
                    var hour_ques =  parseInt(question_time[4].substring(0, 2));
                    var minute_ques =  parseInt(question_time[4].substring(3, 5));
                    var diffHour = Math.max(0, hour_now - hour_ques - 1) // * 60 + minute_now + (60-minute_ques); 
                    // console.log("diffHour: ", diffHour); 
                    
                    if (diffHour == 0) {
                        if (hour_ques == hour_now) {
                            var diffMinute = minute_now - minute_ques; 
                            ques_list[i]["date_and_time"] = diffMinute.toString() + " minutes ago"; 
                        } else {
                            var diffMinute = minute_now + (60-minute_ques); 
                            ques_list[i]["date_and_time"] = diffMinute.toString() + " minutes ago"; 
                        }
                    } else {
                        if (diffHour < 2) {
                            ques_list[i]["date_and_time"] = diffHour.toString() + " hour ago"; 
                        } else {
                            ques_list[i]["date_and_time"] = diffHour.toString() + " hours ago"; 
                        }
                    }
                } else if (diffDays == 1) {
                    ques_list[i]["date_and_time"] = "Yesterday"; 
                } else if (1 < diffDays && diffDays < 8) {
                    ques_list[i]["date_and_time"] = diffDays.toString() + " days ago"; 
                } else {
                    ques_list[i]["date_and_time"] = question_time[1] + " " + day_ques + ", " + year_ques; 
                }

                // For Tags
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

            var tags_list = new Set(); 
            for (var i = 0; i < question_list.length; i++) {
                // for (var j = 0; j < question_list[i]["tags"].length; j++) {
                //     question_list[i]["tags"][j] = "#" + question_list[i]["tags"][j]; 
                // }
                for (var j = 0; j < question_list[i]["tags"].length; j++) {
                    tags_list.add(question_list[i]["tags"][j]); 
                }
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
        const instance = await Questions.find({_id: req.params.id}); 
        
        // var string = JSON.stringify(oneQuestion);
        // var instance = JSON.parse(string);

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
