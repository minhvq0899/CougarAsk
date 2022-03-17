const showdown = require('showdown');

var converter = new showdown.Converter();

var html = converter.makeHtml('#Hello world'); 

let md_test = document.getElementById('md_previewer'); 
md_test.innerHTML = html; 

function update_previewer() {
    const currentBody = document.getElementById('#body').val().toLowerCase();
    const htmlBody = converter.makeHtml(currentBody);
    let md_test = document.getElementById('md_previewer'); 
    md_test.innerHTML = currentBody; 

}

// update_previewer();

$('#body').on('keyup',update_previewer);












