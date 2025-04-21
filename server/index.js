const path = require('path');
const express = require('express');
const { Server } = require('boardgame.io/server');
// ← point at our vendored game logic
const { Backgammon } = require('./vendor/backgammon');

const bgServer = Server({
  games: [Backgammon],
  origin: '*',
});

const app = bgServer.app;

// Serve the React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Always return index.html so client-side routing works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 8000;
bgServer.run(PORT, () => {
  console.log(`🚀 TIB Backgammon listening on port ${PORT}`);
});
