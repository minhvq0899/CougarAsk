// function get_question_object(question) {
//     return `<li>
//             <a href="/each_question/id=${question._id}" method="GET" class="list-group-item list-group-item-action">
//                 <div class="d-flex w-100 justify-content-between">
//                     <h5 class="mb-1">${question.title}</h5>
//                     <small>${question.date_and_time}</small>
//                 </div> 
//                 <p class="mb-1">${question.body}</p>
//                 <small>${question.tags}</small>
//             </a>      
//             </li>`
// }

// function showList(question_list) {
//     $('#question_list').empty();

//     // populate the car_list
//     question_list.forEach( (question) => {
//         $('#question_list').append(get_question_object(question));
//     });

//     // button
//     // $('button').on('click', function () {
//     //     const car_id = $(this).attr('value');
//     //     location.href = "detail.html?car_id=" + car_id;
//     // });
// }


// let all_questions; 

// $.getJSON("/get_all_questions")
//     .done(function (data) {
//         console.log("data: ", data); 
//         all_questions = data.data; 
//         if (data.message === "success") {
//             showList(all_questions);
//         }
//     });



// ------------------------------------------------------------------------------



// function checked_box() {
//     if ($('#most_upvoted').is(':checked')) {
//         console.log("checked");
//         all_questions.sort( (a,b) => {
//             return b.upvote - a.upvote; 
//         })

//         req.questions = all_questions; 
//     }
// }


// function for search functionality
function search_filter(){
    const currentSearch = $('#search_box').val().toLowerCase(); //receive user input in the search box
    // for each loop jQuery
    $.each($('#question_list li'), function (){ // run function for each li elem
       // console.log($(this));
        // search from the title and overview section
        const title = $(this).find('h5').text().toLowerCase();
        const overview = $(this).find('.mb-1 p').text().toLowerCase();

        const hasWord = title.includes(currentSearch) || overview.includes(currentSearch);
        if (hasWord) {
            // console.log(title);
            $(this).show(500);
        }else{
            $(this).hide(500);
        }
    });
}

$('#search_box').on('keyup', search_filter);