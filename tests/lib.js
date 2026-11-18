// Shared helpers for the browser tests.
// Each test opens index.html straight from disk (no server needed), fails on any console
// error or uncaught exception, and reports PASS/FAIL through its exit code.
const { chromium } = require('playwright');
const path = require('path');

const GAME = 'file://' + path.resolve(__dirname, '..', 'index.html');

// Set CHROMIUM_PATH to use a browser that is already installed; otherwise Playwright uses
// the one fetched by `npx playwright install chromium`.
async function launch() {
  const opts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  return chromium.launch(opts);
}

async function openGame(browser, context) {
  const ctx = context || await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(GAME, { waitUntil: 'load' });
  await page.waitForTimeout(150);
  return { page, errors, ctx };
}

// Run one test body; print a verdict and set the exit code.
async function run(name, body) {
  const browser = await launch();
  let ok = false, detail = '';
  try {
    const res = await body(browser);
    ok = res.ok; detail = res.detail || '';
  } catch (e) {
    detail = e.stack || String(e);
  } finally {
    await browser.close();
  }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '\n      ' + detail.split('\n').join('\n      ') : ''}`);
  process.exit(ok ? 0 : 1);
}

module.exports = { launch, openGame, run, GAME };
