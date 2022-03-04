import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import FormGroup from 'react-bootstrap/lib/FormGroup';
// import ControlLabel from 'react-bootstrap/lib/ControlLabel';
// import FormControl from 'react-bootstrap/lib/FormControl';
// const marked = require('marked');

marked.setOptions({
    breaks:true
})

const renderer = new marked.Renderer();

function markdownPreviewer() {
    const [text,setText] = React.useState("");

    return (
        <div className="text-center px-4">
            <textarea
                name="text"
                id="text"
                rows="10"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="textarea">
            </textarea>
        </div>
    ); 
}


// function Preview( {markdown} ) {
//     return(
//         <div
//             dangerouslySetInnerHTML={( __html: marked(markdown, {renderer: renderer}))},
//             id="Preview"
//         >

//         </div>
//     );
// }

ReactDOM.render(<markdownPreviewer />, document.getElementById("root")); 

// export default markdownPreviewer; 



