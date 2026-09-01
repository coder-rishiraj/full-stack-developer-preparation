import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Chess LLD models board, pieces with legal move generation, turn order, check/checkmate/stalemate detection, and castling/en passant as extensions — a deep polymorphism and rules-engine problem.',
  whyExists:
    'Senior LLD benchmark: piece-specific behavior, complex validation, and separating move generation from game state. Shows whether candidate can manage combinatorial rules without god class.',
  mentalModel:
    'Board holds 8×8 squares; Piece subclasses implement getLegalMoves(board, from). Game validates move doesn’t leave king in check. MoveExecutor applies move + capture + promotion. CheckDetector scans attack lines.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: full rules vs simplified (no en passant)? AI? undo?',
        'Classes: Game, Board, Square, Piece (abstract), King/Queen/Rook/Bishop/Knight/Pawn, Move, Color, CheckDetector',
        'Factory or enum for piece creation; Piece knows movement vectors',
        'Validate: piece color matches turn, destination legal, king safe after move',
        'Checkmate: in check and no legal moves; stalemate: not in check, no legal moves',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough (45 min)',
      text: 'Scope down: standard moves only first. Piece polymorphism + Board representation. makeMove pipeline: generate candidates → filter king safety → apply. Add castling if time. Do NOT implement full AI unless asked.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Game {
    -board: Board
    -turn: Color
    +makeMove(Move): MoveResult
  }
  class Board {
    -grid: Piece[8][8]
    +pieceAt(Square): Piece
    +apply(Move)
  }
  class Piece {
    <<abstract>>
    +getLegalMoves(Board, Square): List~Move~
  }
  class King
  class Queen
  class Pawn
  Piece <|-- King
  Piece <|-- Queen
  Piece <|-- Pawn
  class CheckDetector {
    +isInCheck(Board, Color): boolean
    +isCheckmate(Board, Color): boolean
  }
  Game --> Board
  Game --> CheckDetector`,
    caption: 'Polymorphic pieces; detector separate from pieces',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'makeMove with king safety filter',
      code: `public MoveResult makeMove(Move move) {
  Piece piece = board.pieceAt(move.getFrom());
  if (piece == null || piece.getColor() != turn)
    throw new IllegalMoveException("wrong turn");
  List<Move> legal = piece.getLegalMoves(board, move.getFrom());
  if (legal.stream().noneMatch(m -> m.equals(move)))
    throw new IllegalMoveException("illegal");
  Board snapshot = board.copy();
  board.apply(move);
  if (checkDetector.isInCheck(turn))
    { board = snapshot; throw new IllegalMoveException(" leaves king in check"); }
  turn = turn.opposite();
  return MoveResult.ok(checkDetector.status(board, turn));
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Pawn move generation sketch',
      code: `public List<Move> getLegalMoves(Board b, Square from) {
  List<Move> moves = new ArrayList<>();
  int dir = color == Color.WHITE ? 1 : -1;
  Square ahead = from.offset(0, dir);
  if (b.isEmpty(ahead)) moves.add(Move.to(ahead));
  // captures diagonally, double push from start rank...
  return moves;
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Rich polymorphism demo', 'Clear extension points for special rules', 'Tests careful API design'],
    disadvantages: ['Full rules very large for interview time', 'Performance not optimized in naive version'],
    alternatives: ['Bitboards for engines', 'Rule table DSL', 'Single ChessRules service vs piece methods'],
    whenToUse: ['Senior LLD', 'Game engine learning'],
    whenNotToUse: ['30-min junior slot without scoping'],
  },
  failureModes: [
    'Pinned piece moves exposing king',
    'Castling through check not blocked',
    'En passant one-move window missed',
    'Promotion default wrong piece',
  ],
  interview: {
    expectations: ['Piece polymorphism', 'Check filter after tentative move', 'Scope control'],
    commonQuestions: ['Design chess', 'Checkmate detection?'],
    followUps: ['Undo move?', 'Castling rules?', 'Draw by repetition?'],
    misconceptions: ['One move() method with giant switch only — mention polymorphism'],
    traps: ['Implementing full AI instead of move validation'],
    strongSignals: ['Board.copy for trial moves', 'CheckDetector reuse'],
  },
  keyTakeaways: [
    'Piece subclasses generate legal moves.',
    'Always verify king not in check after move.',
    'Board.apply + snapshot rollback for validation.',
    'CheckDetector centralizes attack detection.',
    'Scope special moves explicitly in interview.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core chess classes?', answerHint: 'Game, Board, Piece hierarchy, Move, Color, CheckDetector.' },
    { level: 'intermediate', question: 'Detect check?', answerHint: 'Find king square; see if any opponent piece attacks it.' },
    { level: 'advanced', question: 'Checkmate vs stalemate?', answerHint: 'No legal moves + in check = mate; no legal moves + not in check = stalemate.' },
  ],
  flashcards: [
    { front: 'Legal move filter', back: 'Piece rules + cannot leave own king in check' },
    { front: 'Piece pattern', back: 'Polymorphic getLegalMoves per piece type' },
    { front: 'Trial move', back: 'Copy board, apply, test check, rollback if bad' },
    { front: 'Scope in interview', back: 'Standard moves first; defer castling/en passant' },
  ],
  quickRevision: [
    'Piece polymorphism',
    'makeMove pipeline',
    'CheckDetector',
    'Board snapshot rollback',
    'Scope special rules',
  ],
}
