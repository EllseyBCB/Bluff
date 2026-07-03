import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { GameState, Player, RoundState, Settings } from '../types';
import { pickWord } from '../data/words';
import { generateLobbyCode } from '../net/SyncAdapter';

/**
 * Zentraler Game-State über React Context + Reducer.
 * Alle Phasenwechsel und Spielregeln (Rollen, Stimmen, Punkte)
 * laufen durch diesen Reducer – die Komponenten bleiben schlank.
 */

export const HUMAN_ID = 'you';

/** Demo-Spieler, damit das Spiel sofort ohne echte Mitspieler testbar ist. */
const DEMO_NAMES = ['Mika', 'Luca', 'Anna', 'Samir', 'Leon', 'Emma', 'Noah'];

const DEFAULT_SETTINGS: Settings = {
  playerCount: 6,
  blufferCount: 1,
  totalRounds: 3,
  category: 'Zufall',
};

const INITIAL_STATE: GameState = {
  phase: 'start',
  lobbyCode: '',
  playerName: '',
  settings: DEFAULT_SETTINGS,
  players: [],
  round: null,
  lastResult: null,
  usedWords: [],
};

export type Action =
  | { type: 'CREATE_LOBBY' }
  | { type: 'JOIN_LOBBY'; code: string }
  | { type: 'SET_PLAYER_NAME'; name: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'START_GAME' }
  | { type: 'BEGIN_DISCUSSION' }
  | { type: 'ADD_STATEMENT'; playerId: string; text: string }
  | { type: 'BEGIN_VOTING' }
  | { type: 'CAST_VOTE'; voterId: string; targetId: string }
  | { type: 'RESOLVE_ROUND' }
  | { type: 'SHOW_SCOREBOARD' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SHOW_GAME_OVER' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESET' };

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Baut die Spielerliste: menschlicher Spieler + Demo-Spieler bis zur gewählten Anzahl. */
function buildPlayers(state: GameState): Player[] {
  const human: Player = {
    id: HUMAN_ID,
    name: state.playerName.trim() || 'Du',
    isBot: false,
    role: 'citizen',
    score: 0,
  };
  const bots: Player[] = DEMO_NAMES.slice(0, state.settings.playerCount - 1).map((name, i) => ({
    id: `bot-${i}`,
    name,
    isBot: true,
    role: 'citizen',
    score: 0,
  }));
  return [human, ...bots];
}

/** Verteilt Rollen und wählt ein neues geheimes Wort für die Runde. */
function setupRound(state: GameState, players: Player[], roundNumber: number): GameState {
  const blufferIds = shuffle(players.map((p) => p.id)).slice(0, state.settings.blufferCount);
  const withRoles = players.map<Player>((p) => ({
    ...p,
    role: blufferIds.includes(p.id) ? 'bluffer' : 'citizen',
  }));

  const entry = pickWord(state.settings.category, state.usedWords);
  const round: RoundState = {
    number: roundNumber,
    category: entry.category,
    word: entry.word,
    hint: entry.hint,
    statements: [],
    votes: {},
  };

  return {
    ...state,
    phase: 'roleReveal',
    players: withRoles,
    round,
    lastResult: null,
    usedWords: [...state.usedWords, entry.word],
  };
}

/**
 * Zählt die Stimmen aus und vergibt Punkte.
 * Regeln:
 *  - Bekommt ein Bluffer die meisten Stimmen -> normale Spieler gewinnen (+1 Punkt).
 *  - Sonst gewinnen die Bluffer (+2 Punkte, weil sie unerkannt blieben).
 */
function resolveRound(state: GameState): GameState {
  if (!state.round) return state;

  const tally: Record<string, number> = {};
  for (const targetId of Object.values(state.round.votes)) {
    tally[targetId] = (tally[targetId] ?? 0) + 1;
  }
  const max = Math.max(0, ...Object.values(tally));
  const mostVotedIds = Object.keys(tally).filter((id) => tally[id] === max);

  const blufferCaught = mostVotedIds.some(
    (id) => state.players.find((p) => p.id === id)?.role === 'bluffer',
  );

  const players = state.players.map((p) => {
    if (blufferCaught && p.role === 'citizen') return { ...p, score: p.score + 1 };
    if (!blufferCaught && p.role === 'bluffer') return { ...p, score: p.score + 2 };
    return p;
  });

  return {
    ...state,
    phase: 'reveal',
    players,
    lastResult: { mostVotedIds, blufferCaught },
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'CREATE_LOBBY':
      // Später: syncAdapter.createLobby() aufrufen und Code vom Backend übernehmen.
      return { ...INITIAL_STATE, phase: 'lobby', lobbyCode: generateLobbyCode(), playerName: state.playerName };

    case 'JOIN_LOBBY':
      // Später: syncAdapter.joinLobby(code, name) – im MVP wird die Lobby lokal simuliert.
      return { ...INITIAL_STATE, phase: 'lobby', lobbyCode: action.code.toUpperCase(), playerName: state.playerName };

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.name };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case 'START_GAME': {
      const players = buildPlayers(state);
      return setupRound(state, players, 1);
    }

    case 'BEGIN_DISCUSSION':
      return state.phase === 'roleReveal' ? { ...state, phase: 'discussion' } : state;

    case 'ADD_STATEMENT': {
      if (!state.round || state.phase !== 'discussion') return state;
      // Pro Spieler nur eine Aussage.
      if (state.round.statements.some((s) => s.playerId === action.playerId)) return state;
      return {
        ...state,
        round: {
          ...state.round,
          statements: [...state.round.statements, { playerId: action.playerId, text: action.text }],
        },
      };
    }

    case 'BEGIN_VOTING':
      return state.phase === 'discussion' ? { ...state, phase: 'voting' } : state;

    case 'CAST_VOTE': {
      if (!state.round || state.phase !== 'voting') return state;
      // Jeder darf nur einmal abstimmen; eigene Stimme für sich selbst ist nicht erlaubt.
      if (state.round.votes[action.voterId] || action.voterId === action.targetId) return state;
      // Später: syncAdapter.sendVote(...) für Online-Multiplayer.
      return {
        ...state,
        round: { ...state.round, votes: { ...state.round.votes, [action.voterId]: action.targetId } },
      };
    }

    case 'RESOLVE_ROUND':
      return state.phase === 'voting' ? resolveRound(state) : state;

    case 'SHOW_SCOREBOARD':
      return state.phase === 'reveal' ? { ...state, phase: 'scoreboard' } : state;

    case 'NEXT_ROUND': {
      if (!state.round) return state;
      return setupRound(state, state.players, state.round.number + 1);
    }

    case 'SHOW_GAME_OVER':
      return { ...state, phase: 'gameOver' };

    case 'PLAY_AGAIN':
      // Gleiche Lobby und Einstellungen, aber Punkte und Wörter zurücksetzen.
      return {
        ...state,
        phase: 'lobby',
        players: [],
        round: null,
        lastResult: null,
        usedWords: [],
      };

    case 'RESET':
      return { ...INITIAL_STATE, playerName: state.playerName };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame muss innerhalb von <GameProvider> verwendet werden.');
  return ctx;
}
