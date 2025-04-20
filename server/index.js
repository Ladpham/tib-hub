const path = require('path');
const express = require('express');
const { Server } = require('boardgame.io/server');
const { Backgammon } = require('boardgame.io/examples/src/games/backgammon');

const bgServer = Server({
  games: [Backgammon],
  origin: '*',
});

const app = bgServer.app;

// Serve React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Always serve index.html for client‐side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 8000;
bgServer.run(PORT, () => {
  console.log(`🚀 TIB Backgammon listening on port ${PORT}`);
});
