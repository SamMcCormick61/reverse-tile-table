# Reverse Tile Table

A crossword tile game played backwards. A full game has already been played to the last of the 112 tiles on a 16 × 16 board, then every tile was turned face down. You draw seven letters from that same bag and put each one back where you think it was played.

**Play:** https://sammccormick61.github.io/reverse-tile-table/ (once GitHub Pages is switched on for this repo)

## How it plays

- The board shows the shape of the finished game and every bonus square, but each tile is face down.
- On your turn, drop any number of your seven tiles onto face-down squares, anywhere, and press **Check**.
- **Right** tiles flip face up and score their letter value (doubled on **2L** squares, tripled on **3L**). Your letter points are **multiplied by the number of tiles you got right** that turn.
- **Wrong** tiles cost their letter value (at least 1) and go back in the bag.
- Flip the last face-down tile of a word and you also score the **whole word**, with any **2W** (double) or **3W** (triple) word squares you covered that turn.
- All seven right is a **clean sweep** (+50).
- The game ends when the board is fully face up, the game clock runs out, or everyone passes twice in a row. Tiles left on a rack then count against that player.

### Extra rules (all optional, set before dealing)

- **Turn timer** (30 s to 2 min): run out and your tiles go back on your rack and play moves on.
- **Game clock** (10 to 45 min): when it hits zero the game ends.
- **Opening word**: the first word of the finished game starts face up as a foothold.
- **Show first letters**: the first letter of every word starts face up. Easier and quicker.
- **Mark wrong guesses**: letters already tried on a square are crossed out on it.
- **Peek**: once a turn, pay 10 points to flip any tile.
- **Hot streaks**: back-to-back turns with no wrong tiles earn +10, +20, +30…
- **Pause**: the Pause button (or the P key) stops both clocks and covers the board and rack until you resume. A paused game survives closing the page.
- **Swap**: put tiles back in the bag and draw new ones instead of guessing. It costs the value of every tile you swap and ends your turn.
- Tiles played as **blanks** in the finished game start face up as free clues.
- **Still face down** tracker: counts of every letter still hidden that isn't on your rack.

### Boards

- **Fresh deal**: a brand-new finished game.
- **Today's board**: everyone gets the same board each day, so friends can compare scores.
- **Board codes** (like `E123456`) recreate an exact board. Add `?board=E123456` to the link to share one.
- **Everyday words** builds the board from common English words; **Full word list** uses the whole ENABLE list (much harder).

### Board, tiles and values

This game's board, bag and values are its own:

- The board is **16 × 16**. There's no single middle square, so the first word of the finished game covers one of the four ◆ diamond start squares in the middle.
- Bonus squares are labelled **2L / 3L** (letter ×2 / ×3) and **2W / 3W** (word ×2 / ×3), in this game's own layout.
- The bag holds **112 tiles** (including 2 blanks).
- Face-up tiles are sea-glass green.
- Letter values: A E I N O R S T 1 · D L U 2 · C G H M P Y 3 · B F V W 5 · K 6 · X 8 · J Q Z 9. No letter is worth 4 or 10.

Play solo, or pass one device around for 2 to 4 players. Your game is saved in the browser, so a reload picks up where you left off.

## Android app

The game is also packaged as an Android app for Google Play. [ANDROID.md](ANDROID.md) has every step, from trying it on your phone to publishing.

## How the board is made

`gen.js` plays out a whole game: starting with a word over the middle start squares, it repeatedly finds legal moves (every word across and down must be in the word list, at most seven new tiles a turn) and favors moves that use awkward letters early, until all 112 tiles are on the board. It retries with a new seed if any tiles are left over. It runs in a Web Worker (`gen-worker.js`) so the page stays responsive, and takes a few seconds.

## Files

- `index.html` - the whole game (rules, scoring, board, timers)
- `gen.js` - finished-board generator (also runs under Node for testing)
- `gen-worker.js` - runs the generator off the main thread
- `common.txt` - everyday words: common English words that are also in ENABLE, plus all two-letter words
- `words.txt` - the ENABLE word list (public domain)
- `privacy.html` - privacy policy (needed for Google Play)
- `android/`, `capacitor.config.json`, `scripts/`, `assets/` - the Android app; see [ANDROID.md](ANDROID.md)

Styled to match [Tile Table](https://github.com/SamMcCormick61/tile-table).
