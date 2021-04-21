
let output;
let websocket;
const setbg = (color) => {
    document.getElementById("message").style.background=color
    }
const getElement = (id) => document.getElementById(id);

const addMessage = (message) => {
    const pTag = document.createElement('p');
    pTag.appendChild(document.createTextNode(message));
    getElement('messages').appendChild(pTag);
};

const connect = () => {
    //open socket
    if ("WebSocket" in window){
        output.innerHTML = "CONNECTING..." ;
        ws = new WebSocket(`ws://${location.host}`); 
   
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
    
    const messages = JSON.parse(evt.data);
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
