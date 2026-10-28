// Board generator: plays out a full finished crossword tile game so every tile in the bag ends up on the board.
// Works in the browser (window.RSGen) and in Node (module.exports) so it can be tested from the command line.
(function (root) {
  const N = 15, CENTER = 112;
  // This game's own 100-tile bag: counts follow English letter frequency, values how hard a letter is to use.
  const COUNTS = {A:9,B:2,C:3,D:4,E:11,F:2,G:3,H:3,I:8,J:1,K:1,L:4,M:2,N:6,O:7,P:2,Q:1,R:6,S:5,T:7,U:3,V:2,W:2,X:1,Y:2,Z:1,'?':2};
  const VALUES = {A:1,B:4,C:3,D:2,E:1,F:4,G:3,H:3,I:1,J:9,K:6,L:2,M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,U:2,V:5,W:4,X:8,Y:3,Z:10,'?':0};
  const A = 65;

  function makeRng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }

  // Dictionary wrapper: a Set for lookups plus an index of words by the letters they contain.
  function buildDict(words, maxLen) {
    const list = words.filter(w => w.length >= 2 && w.length <= maxLen && /^[A-Z]+$/.test(w));
    const set = new Set(list);
    const byLetter = Array.from({ length: 26 }, () => []);
    for (const w of list) { const seen = new Set(w); for (const ch of seen) byLetter[ch.charCodeAt(0) - A].push(w); }
    return { list, set, byLetter };
  }

  function generate(opts) {
    const rng = makeRng(opts.seed ?? Math.floor(Math.random() * 2 ** 31));
    const main = opts.main, cross = opts.cross || opts.main, fallback = opts.fallback || null;
    const pick = arr => arr[Math.floor(rng() * arr.length)];
    const board = new Array(225).fill(null); // {ch, blank, turn}
    const pool = new Array(27).fill(0); // 26 = blank
    for (const [ch, n] of Object.entries(COUNTS)) pool[ch === '?' ? 26 : ch.charCodeAt(0) - A] += n;
    let left = 100, turn = 0;
    const words = []; // {word, cells, dir, turn}

    const at = (r, c) => (r < 0 || c < 0 || r >= N || c >= N) ? null : board[r * N + c];
    const letterAt = (r, c) => { const x = at(r, c); return x ? x.ch : null; };

    // Try laying `w` starting at (r,c) in direction d (0 across, 1 down). Returns the plan or null.
    function tryPlace(w, r, c, d, dict, allowBlank, first) {
      const dr = d, dc = 1 - d, L = w.length;
      const er = r + dr * (L - 1), ec = c + dc * (L - 1);
      if (r < 0 || c < 0 || er >= N || ec >= N) return null;
      if (letterAt(r - dr, c - dc) || letterAt(er + dr, ec + dc)) return null;
      const need = pool.slice(); const fresh = []; let touches = first, hits = 0;
      for (let k = 0; k < L; k++) {
        const rr = r + dr * k, cc = c + dc * k, ex = letterAt(rr, cc), ch = w[k];
        if (ex) { if (ex !== ch) return null; hits++; continue; }
        const li = ch.charCodeAt(0) - A; let blank = false;
        if (need[li] > 0) need[li]--; else if (allowBlank && need[26] > 0) { need[26]--; blank = true; } else return null;
        // Perpendicular word through this new tile must be valid.
        let pr = rr - dc, pc = cc - dr; let s = '';
        while (letterAt(pr, pc)) { pr -= dc; pc -= dr; }
        pr += dc; pc += dr;
        let hasCross = false;
        while (true) {
          const isMe = pr === rr && pc === cc;
          const l = isMe ? ch : letterAt(pr, pc);
          if (!l) break;
          if (!isMe) hasCross = true;
          s += l; pr += dc; pc += dr;
        }
        if (hasCross) { if (!cross.set.has(s) && !(fallback && fallback.set.has(s) && s.length <= 3)) return null; touches = true; }
        if (first && rr * N + cc === CENTER) touches = true;
        fresh.push({ i: rr * N + cc, ch, blank });
      }
      if (!fresh.length || fresh.length > 7) return null; // a real turn never lays more than a rack's worth
      if (hits) touches = true;
      if (!touches) return null;
      if (first && !fresh.some(f => f.i === CENTER)) return null;
      if (!dict.set.has(w)) return null;
      return { w, r, c, d, fresh };
    }

    function value(plan) {
      let v = plan.fresh.length * 2 + Math.min(plan.w.length, 6);
      for (const f of plan.fresh) { const x = VALUES[f.ch]; if (!f.blank && x >= 4) v += x * 2; if (f.blank) v -= 12; }
      // Prefer tiles near the edges once the middle fills up, so the board spreads like a real game.
      return v + rng() * 6;
    }

    function commit(plan) {
      turn++;
      for (const f of plan.fresh) {
        board[f.i] = { ch: f.ch, blank: f.blank, turn };
        if (f.blank) pool[26]--; else pool[f.ch.charCodeAt(0) - A]--;
        left--;
      }
      const cells = []; for (let k = 0; k < plan.w.length; k++) cells.push((plan.r + plan.d * k) * N + plan.c + (1 - plan.d) * k);
      words.push({ word: plan.w, cells, dir: plan.d, turn });
    }

    function poolHas(w, extra) { // can we make w from pool plus `extra` board letters?
      const need = pool.slice(); let miss = 0;
      for (const ch of w) { const li = ch.charCodeAt(0) - A; if (need[li] > 0) need[li]--; else miss++; }
      return miss <= extra;
    }

    // Opening move through the center.
    {
      const opts1 = main.list.filter(w => w.length >= 5 && w.length <= 7 && poolHas(w, 0));
      let plan = null;
      for (let t = 0; t < 200 && !plan; t++) {
        const w = pick(opts1), d = rng() < .5 ? 0 : 1, off = Math.floor(rng() * w.length);
        plan = tryPlace(w, d ? 7 - off : 7, d ? 7 : 7 - off, d, main, false, true);
      }
      commit(plan);
    }

    // Search moves anchored on an existing tile.
    function search(dict, tries, wordsPer, allowBlank, exhaustive) {
      const tiles = []; for (let i = 0; i < 225; i++) if (board[i]) tiles.push(i);
      const out = [];
      const anchors = exhaustive ? tiles : Array.from({ length: tries }, () => pick(tiles));
      for (const ai of anchors) {
        const r = Math.floor(ai / N), c = ai % N, L = board[ai].ch;
        for (const d of exhaustive ? [0, 1] : [rng() < .5 ? 0 : 1]) {
          // Skip anchors already inside a word running this way (still allowed: extensions are found via other anchors).
          const cand = dict.byLetter[L.charCodeAt(0) - A];
          const n = exhaustive ? cand.length : Math.min(wordsPer, cand.length);
          const startIdx = Math.floor(rng() * cand.length);
          for (let q = 0; q < n; q++) {
            const w = exhaustive ? cand[q] : cand[(startIdx + q * 7919) % cand.length];
            if (!poolHas(w, allowBlank ? pool[26] + 4 : 4)) continue;
            for (let k = 0; k < w.length; k++) {
              if (w[k] !== L) continue;
              const plan = tryPlace(w, r - d * k, c - (1 - d) * k, d, dict, allowBlank, false);
              if (plan) out.push(plan);
            }
          }
        }
        if (!exhaustive && out.length > 40) break;
      }
      return out;
    }

    let stuck = 0;
    while (left > 0 && stuck < 3) {
      let cands = left > 14 ? search(main, 60, 400, false, false) : [];
      if (!cands.length) cands = search(main, 0, 0, false, true);
      if (!cands.length && fallback) cands = search(fallback, 0, 0, false, true);
      if (!cands.length) cands = search(main, 0, 0, true, true);
      if (!cands.length && fallback) cands = search(fallback, 0, 0, true, true);
      if (!cands.length) { stuck++; continue; }
      let best = null, bv = -1e9;
      for (const p of cands) { const v = value(p); if (v > bv) { bv = v; best = p; } }
      commit(best);
    }
    const leftover = [];
    for (let i = 0; i < 27; i++) for (let k = 0; k < pool[i]; k++) leftover.push(i === 26 ? '?' : String.fromCharCode(A + i));
    return { board, words, turns: turn, placed: 100 - left, leftover };
  }

  // Run generate() several times and keep the first board that uses every tile (or the fullest one).
  function generateFull(opts) {
    const tries = opts.tries || 12; let best = null;
    for (let t = 0; t < tries; t++) {
      const g = generate({ ...opts, seed: (opts.seed ?? Math.floor(Math.random() * 2 ** 31)) + t * 7777 });
      if (!best || g.placed > best.placed) best = g;
      if (g.placed === 100) break;
    }
    return best;
  }

  const api = { buildDict, generate, generateFull, COUNTS, VALUES, N, CENTER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RSGen = api;
})(typeof self !== 'undefined' ? self : this);
