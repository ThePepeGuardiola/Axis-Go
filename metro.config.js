const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any asset extensions you want to handle
config.resolver.assetExts.push(
  // Images
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'ico',
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  // Other
  'mp4',
  'mp3',
  'wav',
  'webm',
  'pdf'
);

module.exports = config; 