// Import required modules
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Create a new Express router
const router = express.Router();

// Use multer with in-memory storage (no need to save in "uploads/")
const upload = multer({ dest: 'temp/' }); // store temp files only

// POST route: extract audio
router.post('/', upload.single('video'), (req, res) => {
  const inputPath = req.file.path; // temp uploaded video
  const outputPath = `temp/${Date.now()}-audio.mp3`;

  ffmpeg(inputPath)
    .toFormat('mp3')
    .on('end', () => {
      // Send the extracted audio as download
      res.download(outputPath, (err) => {
        // Cleanup temp files after sending
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      // Cleanup on error too
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      res.status(500).send(`FFmpeg error: ${err.message}`);
    })
    .save(outputPath);
});

module.exports = router;
