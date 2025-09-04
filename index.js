// Import required modules
const express = require('express'); // Express app
const cors = require('cors'); // CORS for cross-origin requests
require('dotenv').config();

// Import route modules
const extractAudio = require('./routes/extractAudio');
const enhanceAudio = require('./routes/enhanceAudio');
const cleanNoise = require('./routes/cleanNoise');
const auth = require('./routes/auth');

// Create Express app instance
const app = express();

// Enable CORS to allow frontend access
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // Parse JSON bodies

// Mount API routes
app.use('/api/extract-audio', extractAudio); // Route for audio extraction
app.use('/api/enhance-audio', enhanceAudio); // Route for volume enhancement
app.use('/api/clean-noise', cleanNoise); // Route for noise reduction
app.use('/api/auth', auth); // Route for authentication

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔊 SoundMint server running on port ${PORT}`);
});
