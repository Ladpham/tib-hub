// A minimal Backgammon game using boardgame.io core.
// Save this as client/src/vendor/backgammon.js

import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';

/**
 * Roll one die (1–6)
 */
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

export const Backgammon = {
  name: 'backgammon',

  // Initial layout: points 0–23
  setup: () => ({
    points: Array(24).fill(null).map((_, idx) => {
      // Standard starting positions:
      if (idx === 0)  return { player: '0', count: 2 };
      if (idx === 11) return { player: '1', count: 5 };
      if (idx === 16) return { player: '1', count: 3 };
      if (idx === 18) return { player: '1', count: 5 };
      if (idx === 23) return { player: '0', count: 2 };
      if (idx === 12) return { player: '0', count: 5 };
      if (idx === 7)  return { player: '1', count: 3 };
      if (idx === 5)  return { player: '0', count: 5 };
      return { player: null, count: 0 };
    }),
    bar: { '0': 0, '1': 0 },  // checkers on the bar
    off: { '0': 0, '1': 0 },  // borne‑off checkers
    dice: [],                 // the current roll
  }),

  moves: {
    /**
     * Roll the dice once at the start of your turn.
     * Doubles get four of the same die, otherwise two distinct.
     */
    rollDice: {
      move: (G, ctx) => {
        if (G.dice.length) return INVALID_MOVE;
        const d1 = rollDie();
        const d2 = rollDie();
        G.dice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
      },
    },

    /**
     * Move a checker from `fromIdx` to `toIdx` if legal.
     * Very basic bearing‑off & hit logic.
     */
    moveChecker: (G, ctx, fromIdx, toIdx) => {
      const player = ctx.currentPlayer;
      const fromPt = G.points[fromIdx];
      const toPt   = G.points[toIdx];
      if (fromPt.player !== player || fromPt.count === 0) return INVALID_MOVE;

      // Calculate distance in the correct direction
      const dist = player === '0' ? toIdx - fromIdx : fromIdx - toIdx;
      const dieIndex = G.dice.indexOf(dist);
      if (dieIndex === -1) return INVALID_MOVE;

      // Consume that die
      G.dice.splice(dieIndex, 1);

      // Remove checker from origin
      fromPt.count--;
      if (fromPt.count === 0) fromPt.player = null;

      // Handle destination
      if (toPt.player === null || toPt.player === player) {
        // Move onto empty or own point
        toPt.player = player;
        toPt.count++;
      } else if (toPt.count === 1) {
        // Hit opponent blot
        G.bar[toPt.player]++;
        toPt.player = player;
        toPt.count = 1;
      } else {
        return INVALID_MOVE;
      }
    },
  },

  turn: {
    order: TurnOrder.RESET,
    playOrder: (G, ctx) => ['0', '1'],
    onEnd: (G, ctx) => {
      // Clear dice at end of turn
      G.dice = [];
    },
  },

  endIf: (G, ctx) => {
    // Someone has borne off all 15
    if (G.off['0'] === 15) return '0';
    if (G.off['1'] === 15) return '1';
  },

  onEnd: (G, ctx) => {
    // Here you could compute PR & luck and attach to G or ctx.events
    // For now we just return G unchanged
    return G;
  },
};
