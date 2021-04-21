
const {fetchStoreSample, 
       fetchTagSample, 
       fetchSubscribers} =  require('../db')
const {wss} =               require('../events')
const produce =             require('../controllers')
const { g, b, gr, r, y } =  require('../console')

// select all grocery stores and super markets
let venuearray = fetchStoreSample()
let tagarray = fetchTagSample()
let subscriberarray = fetchSubscribers()

module.exports = signal = (router) => {
	router.use(async(req, res, next) => {
    console.log(`Captured ${venuearray.length} venues`)
    console.log(venuearray[100])
    console.log(`Captured ${tagarray.length} tags`)
    console.log(tagarray[100])

    const startSignals = (duration, userid) => new Promise(resolve => {
      const start = new Date().getTime();
    
      let iid;   
    
      (async function loop() {
        const now = new Date().getTime()
        const delta = now - start
        
        //elapsed - close function
        if (delta >= duration) {
          clearTimeout(iid);
          resolve(userid);

        //take action
        } else {
          let venue = venuearray[Math.floor(Math.random() * venuearray.length)]
          let tag = tagarray[Math.floor(Math.random() * tagarray.length)]
          //capture all venues that were randomly selected
          activevenues.push(venue)
          tag.marketid = venue.marketid 
          tag.monitors = venue.monitors
          tag.detectedOn = Date.now()
          delete tag._id
          let message = `---Venue: ${tag.marketid} Product: ${tag.name} Detected: ${tag.detectedOn} -----`
             
           // constant WebSocket.OPEN = 1
          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify([message]))
            }
            });
          
          iid = setTimeout(loop, 3000)
        }
      })()

    });

    const startRandomSignals = (time, i, prefix) => {

      return new Promise(async (resolve, reject) => {
        let venuename = prefix + i.toString()
        await startSignals(time, venuename)
          .then(v => console.log(`${v} finished`))
        resolve()
      })
      
    }

    const startRandomVisitors = (int) => {
      let id
      id = setInterval(function() {
        let arr = []
        let gateway = {
          timestamp: '2020-11-16T20:28:22.456Z',
          type: 'venue',  // note that physical device sets to Gateway
          mac: 'AC233FC07DA5',
          gatewayFree: 42,
          gatewayLoad: 1.15
        }
        let subscriber =
        {
          timestamp: '2020-11-16T20:28:25.365Z',
          type: 'subscriber',
          mac: '0BE383050DE8',
          bleName: '',
          ibeaconUuid: '6A08635B25F7410A8CF860EEFA2E6EAB',
          ibeaconMajor: 1000,
          ibeaconMinor: 1500,
          rssi: -58,
          ibeaconTxPower: -70,
          battery: 0
        }
        // select a random active venue
        let venue = activevenues[Math.floor(Math.random() * activevenues.length)]
        // select a random visitor who has a universal beacon card
        let randomsub = subscriberarray[Math.floor(Math.random() * subscriberarray.length)]
        // mock up a beacon signal -- emulating the gaetway on a venue detecting a visitor
        
        gateway.mac = venue.monitors[0]
        gateway.timestamp = Date.now()
        subscriber.timestamp = Date.now()
        subscriber.ibeaconUuid = randomsub.subscriberid
        arr.push(gateway)
        arr.push(subscriber)      
        
        produce(arr)
      }, int)
    }
     
    res.status(200).redirect('/')

    // Function to start generating random product signals for x number of Venues
    const result = [...Array(VenueCount)].forEach((_, i) => {      
      startRandomSignals(15000, i, 'store')        
    })

    // emit a subscriber signal every 300 milisecond
    console.log(b(`There are ${subscriberarray.length} visitors being detected in ${venuearray.length} venues`))
    startRandomVisitors(300)

    next()
  })  
}
