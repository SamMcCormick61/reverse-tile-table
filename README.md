# Reverse Tile Table

A crossword tile game played backwards. A full game has already been played to the last of the 100 tiles, then every tile was turned face down. You draw seven letters from that same bag and put each one back where you think it was played.

**Play:** https://sammccormick61.github.io/reverse-tile-table/ (once GitHub Pages is switched on for this repo)

## How it plays

- The board shows the shape of the finished game and every bonus square, but each tile is face down.
- On your turn, drop any number of your seven tiles onto face-down squares, anywhere, and press **Check**.
- **Right** tiles flip face up and score their letter value (doubled or tripled on letter squares). Your letter points are **multiplied by the number of tiles you got right** that turn.
- **Wrong** tiles cost their letter value (at least 1) and go back in the bag.
- Flip the last face-down tile of a word and you also score the **whole word**, with any double or triple word squares you covered that turn.
- All seven right is a **bingo** (+50).
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
- **Swap**: put tiles back in the bag and draw new ones instead of guessing (ends your turn).
- Tiles played as **blanks** in the finished game start face up as free clues.
- **Still face down** tracker: counts of every letter still hidden that isn't on your rack.

### Boards

- **Fresh deal**: a brand-new finished game.
- **Today's board**: everyone gets the same board each day, so friends can compare scores.
- **Board codes** (like `E123456`) recreate an exact board. Add `?board=E123456` to the link to share one.
- **Everyday words** builds the board from common English words; **Tournament list** uses the full TWL06 list (much harder).

Play solo, or pass one device around for 2 to 4 players. Your game is saved in the browser, so a reload picks up where you left off.

## How the board is made

`gen.js` plays out a whole game: starting with a word through the center star, it repeatedly finds legal moves (every word across and down must be in the word list, at most seven new tiles a turn) and favors moves that use awkward letters early, until all 100 tiles are on the board. It retries with a new seed if any tiles are left over. It runs in a Web Worker (`gen-worker.js`) so the page stays responsive, and takes a few seconds.

## Files

- `index.html` - the whole game (rules, scoring, board, timers)
- `gen.js` - finished-board generator (also runs under Node for testing)
- `gen-worker.js` - runs the generator off the main thread
- `common.txt` - everyday words: the 20,000 most common English words that are also in TWL06, plus all two-letter words
- `words.txt` - TWL06 word list (from Tile Table)

Styled to match [Tile Table](https://github.com/SamMcCormick61/tile-table).
