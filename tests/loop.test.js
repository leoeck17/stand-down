// The two-cadence loop runs end to end: crisis turns → an alert → alert turns until the
// track resolves → back to crisis → … → the end of the week. Driven by the Space key, so it
// also proves the keyboard follows the primary button through every phase.
const { run, openGame } = require('./lib');

run('crisis week plays through to the debrief', async browser => {
  const { page, errors } = await openGame(browser);
  await page.evaluate(() => { localStorage.clear(); G.tension = 90; });   // force incidents
  const seen = new Set();
  let alerts = 0, confirmedEver = false, guard = 0;
  while (guard++ < 400) {
    const st = await page.evaluate(() => ({ phase: G.phase,
      confirmed: G.tracks.some(t => t.confirmed), modal: document.getElementById('modal').classList.contains('on') }));
    seen.add(st.phase);
    if (st.confirmed) confirmedEver = true;
    if (st.phase === 'over') break;
    if (st.phase === 'alert') alerts++;
    await page.keyboard.press('Space');
  }
  const end = await page.evaluate(() => ({ phase: G.phase, day: G.day, stats: G.stats,
    debrief: document.getElementById('modalTitle').textContent }));
  const S = end.stats;
  const ok = !errors.length && end.phase === 'over' && seen.has('alert') && seen.has('crisis')
    && S.incidents > 0 && S.falseAlarms + S.tests === S.incidents   // every incident resolved
    && end.debrief === 'Debrief';
  return { ok, detail: ok ? `${S.incidents} incidents (${S.falseAlarms} false alarms, ${S.tests} tests), ` +
    `a track reached confirmation: ${confirmedEver}` : JSON.stringify({ end, seen: [...seen], errors }) };
});
