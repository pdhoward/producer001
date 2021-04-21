
const produce = require('../controllers')

//Speed Route
const speed = (router) => {  

    // speed
  router.post("/speed", (req, res, next) => { 
   
      console.log('hello world')
      next()
 
        
  })
 
}
module.exports = speed
