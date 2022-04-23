// Use Showdown package
var converter = new showdown.Converter();

// Constantly write html
function update_previewer() {
    const currentBody = $('#question_body').val(); 
    const htmlBody = converter.makeHtml(currentBody);
    console.log(htmlBody);
    $('#md_previewer').html(htmlBody);  
}


$('#question_body').on('keyup',update_previewer);












