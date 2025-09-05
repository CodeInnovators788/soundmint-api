// Import required modules
const express = require('express'); // Express for routing
const multer = require('multer'); // Multer for file uploads
const ffmpeg = require('fluent-ffmpeg'); // FFmpeg for audio processing
const fs = require('fs'); // File system for cleanup
const path = require('path'); // Path module for cross-platform paths

// Create a router instance
const router = express.Router();

// Configure multer to store uploaded audio files
const upload = multer({ dest: 'uploads/' });

// Ensure outputs directory exists
const outputsDir = path.join(__dirname, '../outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true }); // Create outputs folder if it doesn't exist
}

// Define POST route to clean background noise
router.post('/', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path; // Path to uploaded MP3
  const outputPath = path.join(outputsDir, `${Date.now()}-cleaned.mp3`); // Unique output filename

  ffmpeg(inputPath)
    .audioFilters('afftdn') // Apply FFT-based denoising filter
    .toFormat('mp3') // Convert to MP3 format
    .on('end', () => {
      // Send cleaned file to client
      res.download(outputPath, () => {
        fs.unlinkSync(inputPath); // Delete original uploaded file
        fs.unlinkSync(outputPath); // Delete processed file after download
      });
    })
    .on('error', (err) => {
      // Cleanup files if error occurs
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      res.status(500).send(err.message); // Handle errors
    })
    .save(outputPath); // Save cleaned audio to disk
});

module.exports = router; // Export router for use in main server
