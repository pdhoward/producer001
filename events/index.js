
////////////////////////////////////////////////////////////////
////////////////Register Events and Start Server //////////////
//////////////////////////////////////////////////////////////
const WebSocket =               require('ws')
const {kafka} =                 require('./kafka')
const {socketevents} =          require('./sockets')
//const {dbevents} =              require('./db')
const { g, b, gr, r, y } =      require('../console');

const wss = new WebSocket.Server({noServer: true });

const register = (socket, wss) => {    
  socketevents(socket, wss)  
  //dbevents()
}

wss.on("connection", (socket, req) => {
    register(socket, wss)
    console.log(gr(`Socket Connected with Client`))
    console.info("Total connected clients:", wss.clients.size);
})

const producer = () => {
  return new Promise(async (resolve, reject) => {
    let {producer} = await kafka()
    resolve({producer}) 
  })  
}

module.exports = {
      wss,    
      producer
    }