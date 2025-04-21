// A very simple React UI for our Backgammon logic.
// Save this as client/src/vendor/Board.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Board({ G, ctx, moves, playerID }) {
  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h2>TIB Backgammon — Player {playerID}</h2>

      {/* Simple 2×12 grid of points */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 40px)',
          gridGap: '4px',
          marginBottom: '16px',
        }}
      >
        {G.points.map((pt, idx) => (
          <div
            key={idx}
            style={{
              width: '40px',
              height: '60px',
              border: '1px solid #333',
              background: pt.player === playerID ? '#8f8' : pt.player ? '#f88' : '#eee',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => {
              // If you click a point when dice are rolled, try to move.
              // We assume you clicked a single checker there and target an end point:
              const fromIdx = idx;
              // For demo, pick first available die
              if (G.dice.length > 0) {
                const dist = G.dice[0];
                const toIdx = playerID === '0' ? fromIdx + dist : fromIdx - dist;
                moves.moveChecker(fromIdx, toIdx);
              } else {
                moves.rollDice();
              }
            }}
          >
            {pt.count > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  fontSize: '12px',
                }}
              >
                {pt.count}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dice display & roll button */}
      <div style={{ marginBottom: '16px' }}>
        <strong>Dice:</strong> {G.dice.join(', ')}
        <button
          style={{ marginLeft: '8px', padding: '4px 8px' }}
          onClick={() => moves.rollDice()}
          disabled={G.dice.length > 0}
        >
          Roll Dice
        </button>
      </div>

      {/* Turn info */}
      <div>
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
