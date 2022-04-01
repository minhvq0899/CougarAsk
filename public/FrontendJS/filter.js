// let all_questions = []; 

// $.each($('#question_list li'), function (){ // run function for each li elem
//     all_questions.push($(this));
// });

// console.log(all_questions);


// function checked_box() {
//     if ($('#most_recent').is(':checked')) {
        
//     } else if ($('#most_upvoted').is(':checked')) {
        
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