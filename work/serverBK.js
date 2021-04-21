require('dotenv').config()
const express =   require('express')
const cors =      require('cors')
const path =      require('path')
const mongoose =  require("mongoose");
const multer =    require('multer')

const app = express()
const PORT = process.env.PORT || 5000

 /////////////////////////////////////////////
 /////////  Middleware        ///////////////
 ///////////////////////////////////////////

 app.use(cors())
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 
 /////////////////////////////////////////////////
 /////////         Databases      ///////////////
 ///////////////////////////////////////////////
mongoose.connect(
  "mongodb://localhost:27017/nodeauth",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    console.log(err ||"mongodb connected");
  }
);

const storage = multer.diskStorage({
  destination: `${__dirname}/uploads`,
  filename: (_req, file, callback) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`
    callback(null, filename)
  },
})

const uploadImage = multer({ storage }).single('file')


 /////////////////////////////////////////////////
 ////////// Register and Config Routes //////////
 ///////////////////////////////////////////////
 const header =       express.Router()

//import routes
require('./routes/header')(header)
const userRoutes = require('./routes')


 /////////////////////////////////////////////////
 //////////       API Catalogue       ///////////
 ///////////////////////////////////////////////

 app.use(header)
 app.use("/api/users", userRoutes)

app.post('/image', uploadImage, (req, res) => {
  console.log(req.file)
  if (req.file) return res.json({ msg: 'image successfully uploaded' })
  res.send('Image upload failed')
})


app.listen(PORT, () =>
  console.log(`Server is listening on ${PORT}`)
)
