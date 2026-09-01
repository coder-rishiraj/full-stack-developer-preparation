import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tic-Tac-Toe LLD models a 3×3 board, two players alternating marks, win/draw detection, and game lifecycle — a compact exercise in board representation, validation, and optional AI move selection.',
  whyExists:
    'Gateway game LLD: tests clean Board abstraction, turn enforcement, and extensibility (NxN board, AI) without chess complexity. Often used early in design interviews.',
  mentalModel:
    'Game orchestrates Player turns; Board holds grid state and detects lines. Move(row,col) validates empty cell and current player. GameStatus: IN_PROGRESS, X_WON, O_WON, DRAW. AI can plug via Strategy.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: human vs human, human vs AI, board size fixed 3×3?',
        'Classes: Game, Board, Player, Mark enum (X,O), Move, GameStatus',
        'Board.applyMove updates cell; checkWin after each move',
        'Win: 8 lines (3 rows, 3 cols, 2 diagonals)',
        'Draw: full board no winner',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: '5 min: Board + Game. 10 min: makeMove with validation + win check. 5 min: extend NxN or minimax AI sketch. Keep Board responsible for rules, Game for turn order.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Game {
    -board: Board
    -xPlayer: Player
    -oPlayer: Player
    -current: Player
    -status: GameStatus
    +makeMove(int row, int col)
  }
  class Board {
    -cells: Mark[][]
    +place(row, col, Mark)
    +isEmpty(row, col): boolean
    +checkWinner(): Optional~Mark~
    +isFull(): boolean
  }
  class Player {
    -name: String
    -mark: Mark
  }
  class MoveStrategy {
    <<interface>>
    +pickMove(Board): Move
  }`,
    caption: 'Game manages turns; Board owns grid rules',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'makeMove with win detection',
      code: `public void makeMove(int row, int col) {
  if (status != GameStatus.IN_PROGRESS) throw new IllegalStateException();
  if (!board.isEmpty(row, col)) throw new IllegalMoveException();
  board.place(row, col, current.getMark());
  Optional<Mark> winner = board.checkWinner();
  if (winner.isPresent()) {
    status = winner.get() == Mark.X ? GameStatus.X_WON : GameStatus.O_WON;
    return;
  }
  if (board.isFull()) { status = GameStatus.DRAW; return; }
  current = (current == xPlayer) ? oPlayer : xPlayer;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Win check — rows then cols then diagonals',
      code: `public Optional<Mark> checkWinner() {
  for (int i = 0; i < 3; i++) {
    if (cells[i][0] != Mark.EMPTY && cells[i][0] == cells[i][1] && cells[i][1] == cells[i][2])
      return Optional.of(cells[i][0]);
  }
  // columns and diagonals similarly...
  return Optional.empty();
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Small scope, clear classes', 'Easy AI extension with minimax', 'Good board abstraction practice'],
    disadvantages: ['Too simple for senior-only loop unless extended'],
    alternatives: ['Bitboard for compact state', 'Single int[9] array'],
    whenToUse: ['Warm-up LLD', 'Teaching game loops'],
    whenNotToUse: ['Senior deep dive without NxN/online multiplayer extension'],
  },
  failureModes: [
    'Move after game over',
    'Wrong player mark placed',
    'Off-by-one row/col indices',
    'Win check missed diagonal',
  ],
  interview: {
    expectations: ['Board vs Game separation', 'Win/draw detection', 'Illegal move handling'],
    commonQuestions: ['Design tic-tac-toe', 'Add AI?'],
    followUps: ['NxN board?', 'Online two-player?'],
    misconceptions: ['Win logic in Game only — belongs in Board'],
    traps: ['Not resetting state for new game'],
    strongSignals: ['MoveStrategy for AI', 'Immutable Move records'],
  },
  keyTakeaways: [
    'Board encapsulates grid + win/draw logic.',
    'Game manages players, turns, status.',
    'Validate before every place().',
    '8-line win check or increment counters per move.',
    'AI via Strategy interface (minimax).',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Classes for tic-tac-toe?', answerHint: 'Game, Board, Player, Mark enum, GameStatus.' },
    { level: 'intermediate', question: 'Optimize win detection?', answerHint: 'Track row/col/diag counts per mark on each move O(1).' },
    { level: 'advanced', question: 'Minimax AI sketch?', answerHint: 'Recursively score terminal states; max for AI min for opponent.' },
  ],
  flashcards: [
    { front: 'Board responsibility', back: 'Grid state, empty check, win/draw detection' },
    { front: 'Game responsibility', back: 'Turn order, status, orchestrate moves' },
    { front: 'GameStatus terminal', back: 'X_WON, O_WON, DRAW' },
    { front: 'O(1) win trick', back: 'Increment per-row/col/diag counters on place' },
  ],
  quickRevision: [
    'Game → Board',
    'makeMove validates turn',
    '8 lines win check',
    'Draw = full + no winner',
    'MoveStrategy for AI',
  ],
}
