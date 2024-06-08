const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const audioController = require('./src/controllers/audioController');

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files from public directory

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/upload', upload.single('audioFile'), async (req, res) => {
  try {
    // Process uploaded audio file
    const audioData = await audioController.processAudio(req.file.path);

    // Generate solfa notation
    const solfaNotation = audioController.generateSolfaNotation(audioData);

    // Generate MusicXML from solfa notation
    const musicXML = audioController.generateMusicXML(solfaNotation);

    // Detect key of the song
    const songKey = audioController.detectKey(audioData);

    // Save MusicXML to a temporary file
    const tempFile = path.join(config.uploadDir, config.tempFile);
    fs.writeFileSync(tempFile, musicXML);

    // Send the MusicXML file and song key as a response
    res.json({ notation: musicXML, key: songKey });

    // Remove the temporary file after response is sent
    fs.unlinkSync(tempFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing audio');
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
