var pingbutton = document.getElementById("ping-button")

serverip = 'http://127.0.0.1:5000/'

function sendToPython() {
    var { PythonShell } = require('python-shell');
  
    let options = {
        mode: 'text',
        pythonPath: './env/Scripts/python'
    };
    
    PythonShell.run('./src/backend/server.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('response: ', results);
  
    });
  }


function ping() {
    fetch(serverip).then((data) => {
        return data.text()
    }).then((text) => {
        console.log("data: ", text);
    }).catch(e => {
        console.log(e)
    })
}


sendToPython()

pingbutton.addEventListener('click', () => {
    ping();
});

pingbutton.dispatchEvent(new Event('click'))