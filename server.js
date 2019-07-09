const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');

//CREATE EXPRESS APP
const app = express();
// Open public dir for static file
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// Open CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//ROUTES WILL GO HERE
app.get('/', function(req, res) {
  res.json({ message: 'WELCOME' });
});

// SAVE FILE ON SERVER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  inMemory: true
})

const upload = multer({ storage: storage })

// upload single file ROUTER

app.post('/uploadfile', upload.single('file') ,(req, res, next) => {

  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send({location: `http://localhost:3123/uploads/${file.filename}`})

})
//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }

  res.send(files)

})

app.listen(3123, () => console.log('Server started on port 3123'));
