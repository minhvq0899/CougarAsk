// Use Showdown package
var converter = new showdown.Converter();

const instanceBody = $('.instance_body').text(); 
console.log(instanceBody); 
const htmlBody = converter.makeHtml(instanceBody);
console.log(htmlBody);
$('.instance_body').html(htmlBody);  














