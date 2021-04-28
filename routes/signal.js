
const {kafka,
       fetchRandomTag,
       fetchRandomSubscriber } =  require('../controllers')
const {wss} =                     require('../events')
const {kafkaproducer} =           require('../events')
const {brands} =                  require('../data')
const { g, b, gr, r, y } =        require('../console')

const plans = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Basic']

let producer = {}

const init = async () => {
  producer = await kafkaproducer() 
}

init()

module.exports = signal = (router) => {
	router.use(async(req, res, next) => { 

    let id = undefined
    let x = 0
    let y = 0
    
    const randomStream = (int) => {
      
      id = setInterval(async function() {     
        
        let tag = await fetchRandomTag()  
        let brand = brands[Math.floor(Math.random() * brands.length)]  
        
        y++
        x++
        tag[0].unitsales = Math.floor(Math.random() * (1000 - 100) + 100);
        tag[0].price = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
        tag[0].seq = x
        tag[0].brand = brand
      
        // sockets
        wss.clients.forEach((client) => {      
          if (client.readyState === 1) {
              client.send(JSON.stringify(tag))
          }
        })
         // kafka producer - 
         try {
            let result = await kafka(producer, tag)          
            console.log(result, x)
          } catch (e) {
            console.log(e)
          }

        let subscriber = await fetchRandomSubscriber() 
        
        subscriber[0].name = `${subscriber[0].firstName} ${subscriber[0].lastName}`
        subscriber[0].plan = plans[Math.floor(Math.random() * plans.length)]   
        subscriber[0].location = `${subscriber[0].city}, ${subscriber[0].state}`
        subscriber[0].seq = y
      
        // sockets
        wss.clients.forEach((client) => {      
          if (client.readyState === 1) {
              client.send(JSON.stringify(subscriber))
          }
        })
         // kafka producer - 
         try {
            let result = await kafka(producer, subscriber)          
            console.log(result, y)
          } catch (e) {
            console.log(e)
          }
      
      
      }, int)
    }   
     
    res.status(200).redirect('/')

    // Function to start generating random product signals for x number of Venues

    if (id) {      
      clearInterval(id)
      id = undefined
    } else {
      randomStream(2000) 
    }
       

    next()
  })  
}
