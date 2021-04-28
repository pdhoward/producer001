
const {kafka,
       fetchRandomTag,
       fetchRandomSubscriber,
       fetchStoreSample, 
       fetchTagSample, 
       fetchSubscribers} =  require('../controllers')
const {wss} =               require('../events')
const {kafkaproducer} =     require('../events')
const {brands} =            require('../data')
const { g, b, gr, r, y } =  require('../console')


////////////////////////////////////////////////////
/////     initialize app with sample of record  ///
//////////////////////////////////////////////////

let venuearray = []
let tagarray = []
let subscriberarray = []
let producer = {}

const init = async () => {
  producer = await kafkaproducer()
  venuearray = await fetchStoreSample()
  tagarray = await fetchTagSample()
  subscriberarray = await fetchSubscribers()   
}

init()


module.exports = signal = (router) => {
	router.use(async(req, res, next) => {
    console.log(`Captured ${venuearray.length} venues`)
    console.log(venuearray[100])
    console.log(`Captured ${tagarray.length} tags`)
    console.log(tagarray[100])
    console.log(`Captured ${subscriberarray.length} subscribers`)
    console.log(subscriberarray[100])    

    const randomStream = (int) => {
      let id
      let x = 0
      id = setInterval(async function() {    
       
        // pick off random elements from arrays
        let venue = venuearray[Math.floor(Math.random() * venuearray.length)]
        let tag = tagarray[Math.floor(Math.random() * tagarray.length)]
        let subscriber = subscriberarray[Math.floor(Math.random() * subscriberarray.length)]       
        
        // attach a random price to the object
        x++
        tag.price = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
        tag.seq = x
        
        // sockets
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
              client.send(JSON.stringify([tag]))
          }
        });

        // kafka producer - 
        try {
          let result = await kafka(producer, tag)          
          console.log(result, x)
        } catch (e) {
          console.log(e)
        }
      }, int)
    }
    const plans = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Basic']
    const randomStream = (int) => {
      let id
      let x = 0
      id = setInterval(async function() {          
        
        let tag = await fetchRandomTag()  
        let brand = brands[Math.floor(Math.random() * brands.length)]  
        
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
        let subscriber = await fetchRandomSubscriber() 
        
        subscriber[0].name = `${subscriber[0].firstName} ${subscriber[0].lastName}`
        subscriber[0].plan = plans[Math.floor(Math.random() * plans.length)]   
        subscriber[0].location = `${subscriber[0].city}, ${subscriber[0].state}`
      
        // sockets
        wss.clients.forEach((client) => {      
          if (client.readyState === 1) {
              client.send(JSON.stringify(subscriber))
          }
        })
      
      
      }, int)
    }

    randomStream(1000)   
     
    res.status(200).redirect('/')

    // Function to start generating random product signals for x number of Venues
    randomStream(1000)   

    next()
  })  
}
