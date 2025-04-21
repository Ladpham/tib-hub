// Vendored Backgammon game logic (CommonJS)
// Save as server/vendor/backgammon.js

const { INVALID_MOVE, TurnOrder } = require('boardgame.io/core');

/** Roll one die (1–6) */
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

const Backgammon = {
  name: 'backgammon',

  setup: () => ({
    points: Array(24).fill(null).map((_, idx) => {
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
    bar: { '0': 0, '1': 0 },
    off: { '0': 0, '1': 0 },
    dice: [],
  }),

  moves: {
    rollDice: {
      move: (G, ctx) => {
        if (G.dice.length) return INVALID_MOVE;
        const d1 = rollDie();
        const d2 = rollDie();
        G.dice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
      },
    },

    moveChecker: (G, ctx, fromIdx, toIdx) => {
      const player = ctx.currentPlayer;
      const fromPt = G.points[fromIdx];
      const toPt   = G.points[toIdx];
      if (fromPt.player !== player || fromPt.count === 0) return INVALID_MOVE;

      const dist = player === '0' ? toIdx - fromIdx : fromIdx - toIdx;
      const dieIndex = G.dice.indexOf(dist);
      if (dieIndex === -1) return INVALID_MOVE;

      G.dice.splice(dieIndex, 1);
      fromPt.count--;
      if (fromPt.count === 0) fromPt.player = null;

      if (toPt.player === null || toPt.player === player) {
        toPt.player = player;
        toPt.count++;
      } else if (toPt.count === 1) {
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
    onEnd: (G, ctx) => { G.dice = []; },
  },

  endIf: (G, ctx) => {
    if (G.off['0'] === 15) return '0';
    if (G.off['1'] === 15) return '1';
  },

  onEnd: (G, ctx) => {
    // Compute PR & luck here if desired
    return G;
  },
};

module.exports = { Backgammon };
