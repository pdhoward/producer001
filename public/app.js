

console.log(location)

let output;
let websocket;
let url = ''
let socketurl = ''

if (location.hostname == 'localhost' ) {
    url = `http://${location.host}${'/api/signals'}`
    socketurl = `ws://${location.host}`
} else {
    url = 'https://msskafka.onrender.com/api/signals'
    socketurl = `wss://msskafka.onrender.com`
}

// <input onclick="change()" type="button" value="Open Curtain" id="myButton1"></input>
const change = () => {
    //fetch('http://localhost:5000/api/signals') 
    
    fetch(url)       
    let elem = document.getElementById("jsbutton");
    if (elem.value=="Stop Kafka") {
     elem.value = "Start Kafka"
     elem.className="btn btn-lg btn-success"
    } else {
     elem.value = "Stop Kafka"
     elem.className="btn btn-lg btn-danger"
    }
}

const setbg = (color) => {
    document.getElementById("message").style.background=color
    }
const getElement = (id) => document.getElementById(id);

const generateTableHead = (table, data) => {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
const addTableHead = (message) => {
    let table = document.querySelector("table");
    let data = Object.keys(message);
    generateTableHead(table, data);
}
const generateTable = (message) => {
    let table = document.querySelector("table")   
    let row = table.insertRow();
    for (key in message) {
        let cell = row.insertCell();
        let text = document.createTextNode(message[key]);
        cell.appendChild(text);
    }    
  }
const addMessage = (message) => {
    if (message.seq === 1) {
        addTableHead(message)
    } else {
        generateTable(message)
    }
};

const connect = () => {
    //open socket
    if ("WebSocket" in window){
        output.innerHTML = "CONNECTING..." ;
        ws = new WebSocket(socketurl); 
   
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;
    } else {
        alert("WebSockets not supported on your browser.");
    } 
} 

// event handlers
const onOpen = (evt) =>{
    //called as soon as a connection is opened
    output.innerHTML += "<p>CONNECTED TO SERVER</p>";
}
const onClose = (evt) => {
    //called when connection is severed
    output.innerHTML += "<p>DISCONNECTED</p>";
} 
const onMessage = (evt) => {
    //called on receipt of message
    
    const arr = JSON.parse(evt.data);
    let messages = arr.map(a => {
        let obj = {}
        obj.type = a.type
        obj.name = a.name       
        obj.seq = a.seq
        obj.date = new Date(a.updatedOn).toLocaleString()
        return obj
    })
    messages.forEach(addMessage);
} 
const onError = (evt) => {
    //called on error
    output.innerHTML += "<p class = 'error'>ERROR: " 
      + evt.data + "</p>";
}

const init = () => {
    output = document.getElementById("sysoutput");    
    connect()
} 

init()
