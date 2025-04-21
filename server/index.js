const Koa = require('koa');
const serve = require('koa-static');
const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');
const { Server } = require('boardgame.io/server');
const { Backgammon } = require('./vendor/backgammon');

const bgServer = Server({
  games: [Backgammon],
  origin: '*',
});

const app = bgServer.app;  // this is a Koa app

// 1. Serve the React build folder
app.use(serve(path.join(__dirname, '../client/build')));

// 2. Fallback to index.html for any other route (client‑side routing)
const router = new Router();
router.get('(.*)', (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(
    path.join(__dirname, '../client/build/index.html')
  );
});
app.use(router.routes()).use(router.allowedMethods());

// 3. Start the server
const PORT = process.env.PORT || 8000;
bgServer.run(PORT, () => {
  console.log(`🚀 TIB Backgammon listening on port ${PORT}`);
});
