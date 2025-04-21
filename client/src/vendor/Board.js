// client/src/vendor/Board.js

import React from 'react';
import PropTypes from 'prop-types';
// 1) Import your new board CSS or a board‐drawing component
import './Board.css';

// 2) Import dice image assets from public/
const diceImages = {
  1: '/dice‑1.png',
  2: '/dice‑2.png',
  // …through 6
};

export default function Board({ G, ctx, moves, playerID }) {
  // 3) Helper to compute legal moves for a given point
  function getLegalDestinations(fromIdx) {
    return G.dice
      .map((die) => {
        const toIdx = playerID === '0' ? fromIdx + die : fromIdx - die;
        // replicate your legality check here:
        if (toIdx >= 0 && toIdx < 24) return toIdx;
        return null;
      })
      .filter((idx) => idx !== null);
  }

  return (
    <div className="board‑container">
      <h2>TIB Backgammon — Player {playerID}</h2>

      {/* ───────────────────────────────────────────────────── 
           REPLACE this with your own SVG/Canvas/HTML board. 
      ───────────────────────────────────────────────────── */}
      <div className="points‑grid">
        {G.points.map((pt, idx) => {
          const legal = getLegalDestinations(idx).length > 0;
          return (
            <div
              key={idx}
              className={`point ${pt.player === playerID ? 'mine' : ''} ${
                legal ? 'legal' : ''
              }`}
              onClick={() => {
                // If you’ve rolled dice, try a move,
                // otherwise trigger the roll.
                if (G.dice.length) {
                  const toIdx = getLegalDestinations(idx)[0];
                  moves.moveChecker(idx, toIdx);
                } else {
                  moves.rollDice();
                }
              }}
            >
              {pt.count > 0 && <span className="checker‑count">{pt.count}</span>}
            </div>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────── 
           Render your dice as images, not just numbers.
      ───────────────────────────────────────────────────── */}
      <div className="dice‑row">
        {G.dice.map((d, i) => (
          <img key={i} src={diceImages[d]} alt={`Die ${d}`} className="die" />
        ))}
        <button onClick={() => moves.rollDice()} disabled={G.dice.length > 0}>
          Roll
        </button>
      </div>

      {/* ───────────────────────────────────────────────────── 
           Add Undo and Validate buttons using boardgame.io events.
      ───────────────────────────────────────────────────── */}
      <div className="controls">
        <button
          onClick={() => ctx.events.undo()}
          disabled={!ctx.events.undo}
          className="undo"
        >
          Undo
        </button>
        <button
          onClick={() => ctx.events.endTurn()}
          disabled={G.dice.length > 0}
          className="validate"
        >
          Validate Move
        </button>
      </div>

      <div className="status">
        <em>Current Turn:</em> Player {ctx.currentPlayer}
      </div>
    </div>
  );
}

Board.propTypes = {
  G: PropTypes.object.isRequired,
  ctx: PropTypes.object.isRequired,
  moves: PropTypes.object.isRequired,
  playerID: PropTypes.string,
};
