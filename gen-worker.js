// Builds a finished board off the main thread so the page stays responsive while the "AI game" plays out.
importScripts('gen.js');
const cache = {};
async function list(name) {
  if (!cache[name]) cache[name] = fetch(name).then(r => { if (!r.ok) throw new Error(name + ' ' + r.status); return r.text(); }).then(t => t.split(/\s+/).filter(Boolean));
  return cache[name];
}
const dicts = {};
async function dictsFor(mode) {
  if (dicts[mode]) return dicts[mode];
  const twl = RSGen.buildDict(await list('words.txt'), 8);
  dicts[mode] = mode === 'T' ? { main: twl } : { main: RSGen.buildDict(await list('common.txt'), 8), fallback: twl };
  return dicts[mode];
}
onmessage = async e => {
  try {
    const { seed, mode } = e.data;
    const d = await dictsFor(mode);
    const g = RSGen.generateFull({ ...d, seed, tries: 8 });
    postMessage({ ok: true, board: g.board, words: g.words, placed: g.placed });
  } catch (err) { postMessage({ ok: false, error: String(err && err.message || err) }); }
};
