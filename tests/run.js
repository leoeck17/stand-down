// Runs every *.test.js in this folder, one browser per test, and exits non-zero if any fail.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tests = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort();
let failed = 0;
for (const t of tests) {
  const r = spawnSync(process.execPath, [path.join(__dirname, t)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
