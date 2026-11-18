// The game boots with no errors and draws the board, the units it should, and none it shouldn't.
const { run, openGame } = require('./lib');

run('boots clean and draws the board', async browser => {
  const { page, errors } = await openGame(browser);
  const s = await page.evaluate(() => ({
    phase: G.phase,
    hexes: document.querySelectorAll('#board polygon[data-c]').length,
    unitsDrawn: document.querySelectorAll('#board g[data-uid]').length,
    blue: G.units.filter(u => u.side === 'blue').length,
    redKnown: G.units.filter(u => u.side === 'red' && u.known).length,
    radarOutline: document.querySelectorAll('#board path').length > 0,
    primary: PRIMARY && PRIMARY.textContent,
  }));
  const ok = !errors.length && s.phase === 'crisis' && s.hexes === 900
    && s.unitsDrawn === s.blue + s.redKnown        // hidden enemy forces are NOT drawn
    && s.radarOutline && /End turn/.test(s.primary || '');
  return { ok, detail: ok ? '' : JSON.stringify({ s, errors }) };
});
