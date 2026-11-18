// Save/resume survives a real page reload — mid-alert, with a live track whose sensor
// history is a Set (which JSON does not keep on its own) — and the terrain's distance
// fields come back as Infinity, not null.
const { run, openGame } = require('./lib');

const fingerprint = () => ({
  phase: G.phase, day: G.day, hour: G.hour, readiness: G.readiness,
  tension: G.tension, tensionEst: G.tensionEst, stats: JSON.stringify(G.stats),
  units: G.units.map(u => [u.uid, u.side, u.type, u.col, u.row].join(',')).join('|'),
  tracks: G.tracks.map(t => [t.tid, t.kind, t.col, t.row, t.confirmed, [...t.seen].sort().join('+')].join(',')).join('|'),
  seenIsSet: G.tracks.every(t => t.seen instanceof Set),
  UID, TID,
  infinities: G.distToLand.flat().filter(v => v === Infinity).length,
  nulls: G.distToLand.flat().filter(v => v === null).length,
});

run('save and resume across a page reload', async browser => {
  const ctx = await browser.newContext();
  const { page, errors } = await openGame(browser, ctx);
  const before = await page.evaluate(fp => {
    localStorage.clear(); G.tension = 95; setReadiness(3);
    let guard = 0;
    while (G.phase !== 'alert' && guard++ < 200) endCrisisTurn();
    if (G.phase === 'alert' && G.tracks.length) alertTick();
    saveGame();
    return eval('(' + fp + ')')();
  }, fingerprint.toString());

  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(150);
  const prompt = await page.evaluate(() => !!document.getElementById('rsGo'));
  if (prompt) await page.click('#rsGo');
  await page.waitForTimeout(100);
  const after = await page.evaluate(fp => eval('(' + fp + ')')(), fingerprint.toString());

  const diffs = Object.keys(before).filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
  const ok = prompt && !diffs.length && after.nulls === 0 && after.seenIsSet && !errors.length;
  return { ok, detail: ok ? `resumed in phase "${after.phase}" with ${after.tracks ? after.tracks.split('|').length : 0} live track(s)`
    : JSON.stringify({ prompt, diffs, before, after, errors }) };
});
