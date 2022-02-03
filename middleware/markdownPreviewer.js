import React, { Component } from 'react'; 
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl'; 
const marked = require('marked'); 


function markdownPreviewer() {
    return (
        <div className="markdownPreviewer">
            Hello world !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        </div>
    ); 
}

ReactDOM.render(<markdownPreviewer />, document.getElementById("root")); 

// export default markdownPreviewer; 



