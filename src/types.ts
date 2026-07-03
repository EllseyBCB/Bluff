// Zentrale Typen für den gesamten Game-State.

export type Category = 'Alltag' | 'Fantasy' | 'Tiere' | 'Essen' | 'Schule';

/** In der Lobby wählbar: feste Kategorie oder "Zufall" (jede Runde neu gewürfelt). */
export type CategoryChoice = Category | 'Zufall';

export type Role = 'citizen' | 'bluffer';

export type Phase =
  | 'start'
  | 'lobby'
  | 'roleReveal'
  | 'discussion'
  | 'voting'
  | 'reveal'
  | 'scoreboard'
  | 'gameOver';

export interface Player {
  id: string;
  name: string;
  /** Demo-Spieler werden lokal simuliert. Später: echte Online-Spieler. */
  isBot: boolean;
  role: Role;
  score: number;
}

export interface WordEntry {
  word: string;
  category: Category;
  /** Vager Hinweis, den nur Bluffer sehen. */
  hint: string;
}

export interface Statement {
  playerId: string;
  text: string;
}

export interface RoundState {
  number: number;
  category: Category;
  word: string;
  hint: string;
  statements: Statement[];
  /** voterId -> targetId */
  votes: Record<string, string>;
}

/** Ergebnis einer Runde, berechnet beim Übergang Abstimmung -> Auflösung. */
export interface RoundResult {
  /** Spieler mit den meisten Stimmen (bei Gleichstand mehrere). */
  mostVotedIds: string[];
  /** true = ein Bluffer wurde enttarnt -> normale Spieler gewinnen. */
  blufferCaught: boolean;
}

export interface Settings {
  playerCount: number; // 4–8
  blufferCount: number; // 1–2
  totalRounds: number; // 3, 5 oder 7
  category: CategoryChoice;
}

export interface GameState {
  phase: Phase;
  lobbyCode: string;
  /** Name des lokalen (menschlichen) Spielers. */
  playerName: string;
  settings: Settings;
  players: Player[];
  round: RoundState | null;
  lastResult: RoundResult | null;
  /** Bereits benutzte Wörter, damit sich nichts wiederholt. */
  usedWords: string[];
}
