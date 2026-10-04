import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Read-only application test: no browser, WebGL, or real localStorage writes.
// Run: node tests/flow-test.mjs
const root = path.resolve(process.argv[2] || 'dist');
const dataSource = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const gameSource = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const source = dataSource.replace(/^export /gm, '') + '\n' + gameSource.replace(/^import .*;\r?\n/gm, '');
const saveKey = 'northgate-save-v1';
let assertions = 0;
function check(actual, expected, message) {
  assertions++;
  assert.deepEqual(actual, expected, message);
}
function boot(store = new Map()) {
  const nodes = new Map(), timers = new Map(), events = new Map();
  let timerID = 0;
  const el = selector => {
    if (nodes.has(selector)) return nodes.get(selector);
    const node = {
      hidden: false, disabled: false, innerHTML: '', textContent: '', dataset: {},
      classList: { toggle() {} }, setAttribute() {}, focus() {},
      querySelector: s => el(selector + ' ' + s), querySelectorAll: () => [],
      addEventListener(type, handler) { this[type] = handler; }
    };
    nodes.set(selector, node);
    return node;
  };
  const decisions = ['approve', 'deny', 'detain'].map(action => {
    const node = el('[data-decision="' + action + '"]');
    node.dataset.decision = action;
    return node;
  });
  const document = {
    querySelector: el,
    querySelectorAll: s => s === '[data-decision]' ? decisions : [],
    activeElement: el('focus'),
    addEventListener: (name, fn) => events.set(name, fn)
  };
  const context = vm.createContext({
    console, document,
    localStorage: { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) },
    createScene: () => ({ setTraveler() {}, setDay() {}, portrait: () => '', setView() {}, leave() {}, scan() {} }),
    setTimeout: (callback, ms) => { timers.set(++timerID, { callback, ms }); return timerID; },
    clearTimeout: id => timers.delete(id), setInterval: () => 0, window: {}
  });
  vm.runInContext(source, context, { filename: 'northgate-test-bundle.js' });
  const run = expression => vm.runInContext(expression, context);
  const json = expression => JSON.parse(run('JSON.stringify(' + expression + ')'));
  const click = dataset => el('#app').click({ target: { closest: () => ({ dataset, disabled: false }) } });
  const escape = () => events.get('keydown')({ key: 'Escape', preventDefault() {} });
  const scan = expectedMs => {
    run('startScan()');
    const found = [...timers.entries()].find(([, timer]) => timer.ms === expectedMs);
    assert.ok(found, 'scan schedules expected duration ' + expectedMs);
    timers.delete(found[0]);
    found[1].callback();
    check(run('scanned'), true, 'scan completes through its timer');
  };
  const snapshot = () => { const value = json('state'); delete value.version; return value; };
  const saved = () => JSON.parse(store.get(saveKey));
  return { store, run, json, click, escape, scan, snapshot, saved, el, decisions };
}

// Repro 1: both a successful and incorrect decision survive immediate reload.
let app = boot();
check(app.run('decide("approve")'), false, 'cannot decide without scan');
app.scan(2100);
check(app.run('decide("approve").correct'), true, 'first traveler approves');
check(app.saved().total, 1, 'first decision is saved immediately');
let before = app.snapshot();
app = boot(app.store);
check(app.snapshot(), before, 'reload preserves first completed decision');
check(app.run('decided && scanned'), true, 'completed inspection restored');
check(app.el('#result-banner').hidden, false, 'restored result banner visible');
check(app.el('#result-banner').innerHTML.includes('下一位旅客'), true, 'visible next control restored');
check(app.decisions.every(b => b.disabled), true, 'restored decision buttons disabled');
check(app.run('decide("approve")'), false, 'cannot award a restored decision twice');
check(app.snapshot(), before, 'duplicate decision makes no mutation');
app.click({ action: 'next' });
app.scan(2100);
check(app.run('decide("approve").correct'), false, 'expired passport creates intended incorrect decision');
before = app.snapshot();
check({ total: before.total, correct: before.correct, credits: before.credits, integrity: before.integrity },
      { total: 2, correct: 1, credits: 130, integrity: 93 }, 'incorrect decision penalty recorded');
app = boot(app.store);
check(app.snapshot(), before, 'immediate reload preserves incorrect decision and penalty');
check(app.el('#result-banner').innerHTML.includes('应拒绝入境'), true, 'incorrect result explanation restored');
console.log('PASS: immediate successful/incorrect decision saves, restores, and cannot be double-awarded');

// Manually reviewed expected sequence; not obtained from the implementation oracle.
const expected = [
  ['approve','deny','deny','detain','approve','deny'],
  ['deny','approve','deny','deny','deny','approve'],
  ['deny','deny','approve','deny','detain','approve'],
  ['approve','detain','approve','deny','detain','deny'],
  ['deny','approve','detain','deny','deny','approve']
];
app = boot();
check(app.run('DAYS[1].rules.some(r => r.includes("防伪") && r.includes("拒绝"))'), true,
      'day two publicly states missing anti-forgery mark means denial');
for (let day = 1; day <= 5; day++) {
  for (let index = 0; index < 6; index++) {
    check(app.json('({day:state.day,index:state.index})'), { day, index }, 'traveler order');
    check(app.run('verdictFor(p,state.day).action'), expected[day-1][index], 'independent expected verdict');
    app.scan(day === 1 ? 2100 : 650);
    if (day >= 2) check(app.run('uv'), true, 'purchased ultraviolet upgrade auto-inspects');
    check(app.run('decide(' + JSON.stringify(expected[day-1][index]) + ').correct'), true, 'correct verdict accepted');
    before = app.snapshot();
    check(app.saved().history.length, (day-1)*6+index+1, 'each verdict is persisted');
    app = boot(app.store); // refresh after every single traveler
    check(app.snapshot(), before, 'refresh preserves exact state');
    check(app.run('decided && scanned'), true, 'refresh restores completed case');
    check(app.el('#result-banner').hidden, false, 'refresh keeps visible result');
    if (index < 5) {
      check(app.run('modalOpen'), false, 'mid-shift restore has no blocking modal');
      app.click({ action: 'next' });
    }
  }
  check(app.run('modalOpen'), true, 'sixth-decision reload restores daily summary');
  app.escape();
  check(app.run('modalOpen'), false, 'Escape closes summary');
  check(app.el('#result-banner').hidden, false, 'closing restored summary retains result');
  check(app.el('#result-banner').innerHTML.includes('本班结算'), true, 'visible settlement button remains');
  app.click({ action: 'next' });
  check(app.run('modalOpen'), true, 'visible settlement button reopens summary');
  before = app.snapshot();
  app.run('endDay();endDay()');
  check(app.snapshot(), before, 'repeated summaries never repeat rewards');
  if (day === 1) {
    app.click({ upgrade: 'scanner' });
    check(app.run('state.credits'), 190, 'scanner costs 80 once');
    app.click({ upgrade: 'scanner' });
    check(app.run('state.credits'), 190, 'scanner cannot be purchased twice');
    app.click({ upgrade: 'uv' });
    check(app.run('state.credits'), 90, 'UV costs 100 once');
    app.click({ upgrade: 'uv' });
    check(app.run('state.credits'), 90, 'UV cannot be purchased twice');
    before = app.snapshot();
    app = boot(app.store);
    check(app.snapshot(), before, 'purchases survive reload');
  }
  console.log('PASS: day ' + day + ' / ' + app.run('state.correct') + ' correct / ' + app.run('state.total') + ' total');
  if (day < 5) {
    app.click({ action: 'advance' });
    check(app.run('modalOpen'), true, 'next-day briefing displayed');
    app.click({ action: 'close' });
  }
}
check(app.json('({total:state.total,correct:state.correct,score:state.score,credits:state.credits,bestCombo:state.bestCombo})'),
      { total: 30, correct: 30, score: 1005, credits: 690, bestCombo: 30 }, 'campaign final accounting including both upgrades');
check(app.el('#modal').innerHTML.includes('边境守望者'), true, 'perfect campaign ending');
check(app.run('verdictFor({...createTraveler(2,1),goods:[{weight:40,declared:true}]},2).action'), 'approve', 'exact 40 kg allowed');
check(app.run('verdictFor({...createTraveler(2,1),goods:[{weight:40.001,declared:true}]},2).action'), 'deny', 'above 40 kg denied');
check(app.run('verdictFor(createTraveler(4,0),4).action'), 'approve', 'same name without wanted ID allowed');
check(app.run('verdictFor(createTraveler(5,2),5).action'), 'detain', 'detention wins over expired passport');
check(app.run('verdictFor(createTraveler(5,5),5).action'), 'approve', 'expiry on today valid');
app.click({ action: 'restart' });
check(app.json('({day:state.day,index:state.index,total:state.total,history:state.history.length,run:state.run,credits:state.credits,upgrades:state.upgrades})'),
      { day: 1, index: 0, total: 0, history: 0, run: 1, credits: 120, upgrades: {} }, 'new campaign fully resets progress');
console.log('PASS: 30-person flow, all five restored summaries, both upgrades, and boundary rules');
console.log('Assertions:', assertions);
console.log('data.js SHA256:', crypto.createHash('sha256').update(dataSource).digest('hex'));
console.log('game.js SHA256:', crypto.createHash('sha256').update(gameSource).digest('hex'));
console.log('Scope: VM DOM/scene/timer stubs; this does not verify browser layout, WebGL, or real storage availability.');
