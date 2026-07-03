import type { Player, RoundState } from '../types';

/**
 * ─────────────────────────────────────────────────────────────
 *  VORBEREITUNG FÜR ECHTES ONLINE-MULTIPLAYER
 * ─────────────────────────────────────────────────────────────
 * Diese Schnittstelle kapselt alles, was später über ein Backend
 * (Firebase, Supabase oder WebSockets) laufen soll. Die UI spricht
 * ausschließlich mit diesem Adapter – zum Umstellen auf echtes
 * Multiplayer muss nur eine neue Implementierung dieser Klasse
 * geschrieben und in GameContext eingesetzt werden.
 */
export interface SyncAdapter {
  /** Lobby erstellen: gibt den Lobby-Code zurück. */
  createLobby(hostName: string): Promise<string>;

  /** Lobby beitreten: meldet einen Spieler bei einer bestehenden Lobby an. */
  joinLobby(code: string, playerName: string): Promise<void>;

  /** Spieler synchronisieren: informiert über Beitritte/Austritte. */
  onPlayersChanged(callback: (players: Player[]) => void): void;

  /** Stimmen synchronisieren: eigene Stimme an alle senden. */
  sendVote(voterId: string, targetId: string): Promise<void>;

  /** Rundenstatus synchronisieren: Phase, Wort, Aussagen usw. teilen. */
  syncRoundState(round: RoundState): Promise<void>;
}

/**
 * Lokale MVP-Implementierung ohne Backend.
 * Alle Mitspieler werden im Browser simuliert, daher sind die
 * meisten Methoden bewusst leere Platzhalter.
 */
export class LocalAdapter implements SyncAdapter {
  async createLobby(_hostName: string): Promise<string> {
    // Später: Lobby-Dokument in Firebase/Supabase anlegen.
    return generateLobbyCode();
  }

  async joinLobby(_code: string, _playerName: string): Promise<void> {
    // Später: Spieler in die Lobby-Tabelle eintragen / Socket verbinden.
  }

  onPlayersChanged(_callback: (players: Player[]) => void): void {
    // Später: Realtime-Subscription (z. B. Supabase channel / Firestore onSnapshot).
  }

  async sendVote(_voterId: string, _targetId: string): Promise<void> {
    // Später: Stimme ans Backend schicken, Ergebnis serverseitig zählen.
  }

  async syncRoundState(_round: RoundState): Promise<void> {
    // Später: Rundenstatus broadcasten, damit alle Clients synchron sind.
  }
}

/** Erzeugt einen gut lesbaren 5-stelligen Lobby-Code (ohne 0/O/1/I). */
export function generateLobbyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Der aktuell aktive Adapter. Hier später LocalAdapter durch die Online-Variante ersetzen. */
export const syncAdapter: SyncAdapter = new LocalAdapter();
