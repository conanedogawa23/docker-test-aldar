const mongoose = require('mongoose');

const imageMetadataSchema = new mongoose.Schema({
  // Basic Information
  filename: {
    type: String,
    required: true,
  },
  size: {  // in bytes
    type: Number,
    required: true,
  },
  format: { // e.g., JPEG, PNG, GIF
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  
  // Image Dimensions
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },

  // Image Source or Origin (e.g., "Camera", "Graphic Design Software", "Web")
  source: {
    type: String,
  },

  // Author or creator
  author: {
    type: String,
  },

  // Software used for creation or editing
  software: {
    type: String,
  },

  // Color depth (e.g., "16M" for 16 Million colors)
  colorDepth: {
    type: String,
  },
  
  // Image resolution (dots per inch)
  resolutionDPI: {
    type: Number,
  },
  
  // Compression type if any (e.g., lossy, lossless)
  compression: {
    type: String,
  },
  
  // Image category or type (e.g., "Portrait", "Landscape", "Abstract")
  category: {
    type: String,
  },

  // Associated keywords or tags
  tags: [{
    type: String,
  }],

  // Description or any notes about the image
  description: {
    type: String,
  },

  // Licensing information
  license: {
    type: String,
  },
  
  // Any related URL or reference link
  referenceUrl: {
    type: String,
  },

});

const ImageMetadata = mongoose.model('image_data', imageMetadataSchema);

module.exports = ImageMetadata;
