// Import required modules
const express = require('express'); // Express for routing
const multer = require('multer'); // Multer for handling file uploads
const ffmpeg = require('fluent-ffmpeg'); // FFmpeg wrapper for media processing
const fs = require('fs'); // File system for cleanup

// Create a router instance
const router = express.Router();

// Configure multer to store uploaded audio files in 'uploads/'
const upload = multer({ dest: 'uploads/' });

// Define POST route to enhance audio volume
router.post('/', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path; // Path to uploaded MP3
  const outputPath = `outputs/${Date.now()}-enhanced.mp3`; // Unique output filename

  ffmpeg(inputPath)
    .audioFilters('volume=50') // Apply volume boost (2x)
    .toFormat('mp3') // Convert to MP3 format
    .on('end', () => {
      res.download(outputPath, () => {
        // Send enhanced file to client
        fs.unlinkSync(inputPath); // Delete original uploaded file
        fs.unlinkSync(outputPath); // Delete processed file after download
      });
    })
    .on('error', (err) => res.status(500).send(err.message)) // Handle errors
    .save(outputPath); // Save enhanced audio to disk
});

module.exports = router; // Export router for use in main server
