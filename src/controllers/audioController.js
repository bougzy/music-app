// src/controllers/audioController.js
const fs = require('fs');
const { processAudio, generateSolfaNotation } = require('../services/audioService');
const { generateMusicXML } = require('../services/musicService');
const { detectKey } = require('../services/audioService');

exports.uploadAudio = async (req, res) => {
  try {
    // Process uploaded audio file
    const audioData = await processAudio(req.file.path);

    // Generate solfa notation
    const solfaNotation = generateSolfaNotation(audioData);

    // Generate MusicXML from solfa notation
    const musicXML = generateMusicXML(solfaNotation);

    // Detect key of the song
    const songKey = detectKey(audioData);

    // Save MusicXML to a temporary file
    const tempFile = 'temp.musicxml';
    fs.writeFileSync(tempFile, musicXML);

    // Send the MusicXML file and song key as a response
    res.json({ notation: musicXML, key: songKey });

    // Remove the temporary file after response is sent
    fs.unlinkSync(tempFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing audio');
  }
};
