const conn =                require('../db/connections')
const { g, b, gr, r, y } =  require('../console')

// env variables for auth db and subscribers
const authUri = process.env.ATLAS_AUTH
const authCollection = process.env.ATLAS_AUTH_SUBSCRIBERS
const authDb = process.env.ATLAS_AUTH_DB
// env variables for proximity db and collections
const proximityurl = process.env.ATLAS_PROXIMITY_URI
const proximityDb = process.env.ATLAS_PROXIMITY_DB
const proximityVenues = process.env.ATLAS_PROXIMITY_MARKETS
const proximitySubscribers = process.env.ATLAS_PROXIMITY_SUBSCRIBERS
const proximityActiveTags = process.env.ATLAS_PROXIMITY_ACTIVETAGS
/**
 * Search the database for a venue
 * @param {String} token The user's access token
 */


const findVenue = (venue) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(proximityurl, proximityDb)
        
        let token = 'unknown'
        // find mac and validate against registered venue device
        // returns an empty array if venue not in db
        if (venue){token = venue[0].mac}   
        db.collection(proximityVenues)
            .find({monitors: token })                     
            .toArray()
            .then((result) => {  
                if (result.length > 0) delete result[0].monitors
                resolve(result)
            })
            .catch(err => reject(err))        
    })
}

const findSubscriberAndUpdate = (signal, venue) => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(authUri, authDb)
        let signalUUID = signal.ibeaconUuid
        let marketid = venue[0].marketid
        let marketstamp = Date.now()
        // updates doc but returns the pre-updated one - with marketstamp reflecting time of last detected signal
        db.collection(authCollection)
            .findOneAndUpdate({uuid: signalUUID }, {$set: {marketid: marketid, marketstamp: marketstamp}, $inc: {marketnotices: 1}})
            .then((result) => {               
                if (result.value) {                    
                    resolve([result.value])
                } else {
                    resolve([])
                }
                
            })
            .catch(err => reject(err))      
    })
}

// find active product tags for a specific venue
const findActiveTags = (parm) => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(proximityurl, proximityDb)      

        db.collection(proximityActiveTags)
            .find(parm)
            .toArray()
            .then((result) => {                 
                resolve(result)
            })
            .catch(err => reject(err))       
    })
}

// select a sample of stores
const fetchStoreSample = ( ) => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(proximityurl, proximityDb)      

        db.collection('venues')
            .find({market: {$in: ['Grocery Stores', 'Supermarkets']}})
            .toArray()
            .then(data => {
              let newarray = data.map(d => d.marketid)
              resolve(newarray) 
            })  
    })
}

// select a sample of product tags
const fetchTagSample = () => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(proximityurl, proximityDb)      

        db.collection('tags')
        .aggregate([{$sample: {size: 1000}}])
        .toArray()
        .then(data => {      
         resolve(data)
        })
    })
}

// select a sample of product tags
const fetchSubscribers = () => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(proximityurl, proximityDb)      

        db.collection('subscribers')
        .aggregate([{$sample: {size: 5000}}])
        .toArray()
        .then(data => {      
          resolve(data)
        })
    })
}

module.exports = {    
    findVenue,
    findSubscriberAndUpdate,
    findActiveTags,
    fetchStoreSample,
    fetchTagSample,
    fetchSubscribers
}

