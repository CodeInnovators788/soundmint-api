// Import required modules
const express = require('express'); // Express for routing
const multer = require('multer'); // Multer for file uploads
const ffmpeg = require('fluent-ffmpeg'); // FFmpeg for audio processing
const fs = require('fs'); // File system for cleanup

// Create a router instance
const router = express.Router();

// Configure multer to store uploaded audio files
const upload = multer({ dest: 'uploads/' });

// Define POST route to clean background noise
router.post('/', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path; // Path to uploaded MP3
  const outputPath = `outputs/${Date.now()}-cleaned.mp3`; // Unique output filename

  ffmpeg(inputPath)
    .audioFilters('afftdn') // Apply FFT-based denoising filter
    .toFormat('mp3') // Convert to MP3 format
    .on('end', () => {
      res.download(outputPath, () => {
        // Send cleaned file to client
        fs.unlinkSync(inputPath); // Delete original uploaded file
        fs.unlinkSync(outputPath); // Delete processed file after download
      });
    })
    .on('error', (err) => res.status(500).send(err.message)) // Handle errors
    .save(outputPath); // Save cleaned audio to disk
});

module.exports = router; // Export router for use in main server
