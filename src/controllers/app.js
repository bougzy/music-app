const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const audioController = require('./src/controllers/audioController');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files from public directory

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/upload', upload.single('audioFile'), audioController.uploadAudio);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
