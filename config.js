// Reverse Tile Table settings.
//
// Change a value, save this file and reload the game. Colours are any CSS colour: '#3a7bd5', 'teal',
// 'rgb(40, 120, 90)'. Delete a line (or the whole file) and the game goes back to its built-in default.
//
// Online games: every player's copy of the game should use the same letterValues and scoring,
// or their scores will be worked out differently.
window.RTT_CONFIG = {
  colors: {
    // The table and side panels
    table: '#2a1a12',
    panel: '#33221a',
    text: '#f3e9d8',
    accent: '#f2b84b',          // turn pill, selected tile, buttons

    // The board
    board: '#4a4e55',           // frame around the squares
    boardEdge: '#2e3136',
    square: '#a9adb3',          // plain squares
    squareText: '#3c4046',

    // Bonus squares (background, then label colour), used for the tile badges and the 'all' view
    word3: '#5b3d9a',   word3Text: '#f4eeff',    // 3W
    word2: '#b9a6e6',   word2Text: '#2f1d5c',    // 2W
    letter3: '#1d8a5c', letter3Text: '#eafff4',  // 3L
    letter2: '#c9e46e', letter2Text: '#2f3d06',  // 2L

    // Face-up tiles
    tile: '#dff3ea',
    tileShade: '#a7d5c3',
    tileText: '#10302a',
    tileEdge: '#4f8a76',

    // Face-down tiles (the backs)
    tileBack: '#9a6b3e',
    tileBackShade: '#6e4627',
    tileBackEdge: '#4a2d17',
  },

  // Points per letter. Only list the letters you want to change, e.g. { Q: 8, Z: 8 }.
  // Leave it empty to use the game's own values (Q, Z, J 9 · X 8 · K 6 · B, F, V, W 5 · ...).
  letterValues: {},

  scoring: {
    cleanSweep: 50,             // bonus for getting all seven tiles right in one turn
    peekCost: 10,               // points a peek costs
    revealTokens: 3,            // secret reveals each player gets (0 turns them off)
    streakStep: 10,             // hot streak bonus grows by this much each perfect turn
  },

  timers: {
    turnSeconds: [0, 30, 60, 90, 120],    // turn timer choices on the setup screen (0 = off)
    defaultTurnSeconds: 60,
    gameMinutes: [0, 10, 20, 30, 45],     // game clock choices (0 = off)
  },

  board: {
    // Which view the Focus button starts on, the first time the game is opened on a device:
    //   'standard' - plain dark-grey empty squares, with a 2L/3L/2W/3W badge on tiles that sit on a bonus square
    //   'focus'    - the same, without the badges
    //   'all'      - every bonus square coloured and labelled, as a map of the board
    defaultView: 'standard',
  },
};
