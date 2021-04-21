## Click


* sample - auth
https://github.com/bipan82gill/Cuisine-Recipe

https://dev.to/itsmefarhan/cloudinary-files-images-crud-operations-with-nodejs-express-multer-2147


https://stackoverflow.com/questions/44536437/what-is-the-correct-syntax-to-pass-a-base64-instead-of-a-url-to-microsoft-azure

https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/ComputerVisionQuickstart.js

https://github.com/viane/microsoft-computer-vision

/*
const microsofComputerVision = require("microsoft-computer-vision")
const myKey = "xxxxxxxxx"
const path = require('path')
const express = require('express')
const app = express()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage }).single('image')

app.post('/upload',  (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err)
      return
    }

    // Everything went fine
    microsofComputerVision.tagImage({
      "Ocp-Apim-Subscription-Key": myKey,
      "content-type": "multipart/form-data",
      "body": req.file,
      "request-origin":"westus"
    }).then((result) => {
        // do stuff with result
    }).catch((err)=>{
      throw err
    })
  })
})

