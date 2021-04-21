///////////////////////////////////////////////////////////////
////////        Proxy Server ---  STREAMS              ///////
//////            mainline processing                 ///////
//////           c all rights reserved               ///////
///////////////////////////////////////////////////////////

const express =               require('express')
const cors =                  require('cors')
const { createServer } =      require('http')
const path =                  require('path')
const transport =             require('../config/gmail')
const { g, b, gr, r, y } =    require('../console');

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 5000;

////////////////////////////////////////
//////middleware and static routes/////
///////////////////////////////////////
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/uploads/images', express.static(path.join('uploads','images')))

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

//////////////////////////////////////////////////////////////////
////////////  Event Registration for streams and db      ////////
////////////////////////////////////////////////////////////////

const {wss} = require('../events');

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
    });     
})

/////////////////////////////////////////
///// alerts for platform errors ///////
///////////////////////////////////////

const handleErr = (err) => {
  console.log('uncaught exception')
  console.log(err)
}

const mailObject = {
  from: process.env.TRANSPORT_LABEL,
  to: process.env.TRANSPORT_RECEIVER,
  subject: 'Platform Error',
  text: ''
}
process.on('uncaughtException', function (er) {
    console.log("uncaught exception")
    console.error(er.stack)
    mailObject.text = er.stack;
    transport.sendMail(mailObject, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
  })
 
 /////////////////////////////////////////////////
 ///// Register and Config Routes ///////////////
 ///////////////////////////////////////////////
 const about =       express.Router()
 const header =      express.Router() 
 const auth =        express.Router({mergeParams: true}) 
 const speed =       express.Router({mergeParams: true}) 
 const test =        express.Router({mergeParams: true})

 require('../routes/about')(about)
 require('../routes/header')(header)
 require('../routes/auth')(auth)
 require('../routes/speed')(speed)
 require('../routes/test')(test)

///////////////////////////////////////////////////////////////
//////////  api routes - realtime signal processing  /////////
/////////////////////////////////////////////////////////////

app.use(header)
app.get('/about', about)

////////////////////////////////////////////////////////
//////////       api routes - streaming       /////////
//////////////////////////////////////////////////////

app.use("/api/auth", [auth])

app.use('/api/speed', [speed])

///////////////////////////////////
///////     active servers ///////
/////////////////////////////////

server.listen(PORT, () => console.log(g(`Listening on Port ${PORT}`)))
