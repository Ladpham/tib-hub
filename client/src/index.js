import React from 'react';
import ReactDOM from 'react-dom';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Backgammon } from './Game';
import Board from './Board';
import './index.css';

const App = Client({
  game: Backgammon,
  board: Board,
  numPlayers: 2,
  debug: false,
  multiplayer: SocketIO({ server: 'https://tib-hub.onrender.com' }),
  setupData: { matchID: 'TIB', target: 5 },
});

ReactDOM.render(
  <div>
    <header>
      <img src="/tib-logo.png" alt="TIB Logo" />
      <h1>TIB Backgammon</h1>
    </header>
    <App playerID="0" matchID="TIB" />
  </div>,
  document.getElementById('root')
);
