import { useEffect } from 'react';
import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import type { Player } from '../types';

/**
 * Simuliert das Abstimmverhalten eines Demo-Spielers:
 * Bluffer schützen sich gegenseitig, normale Spieler haben eine
 * gewisse Chance, den Bluffer richtig zu verdächtigen.
 */
function botVote(bot: Player, players: Player[]): string {
  const others = players.filter((p) => p.id !== bot.id);
  if (bot.role === 'bluffer') {
    const nonBluffers = others.filter((p) => p.role !== 'bluffer');
    const pool = nonBluffers.length > 0 ? nonBluffers : others;
    return pool[Math.floor(Math.random() * pool.length)].id;
  }
  const bluffers = others.filter((p) => p.role === 'bluffer');
  if (bluffers.length > 0 && Math.random() < 0.45) {
    return bluffers[Math.floor(Math.random() * bluffers.length)].id;
  }
  return others[Math.floor(Math.random() * others.length)].id;
}

/** Abstimmungsphase: alle Spieler als antippbare Karten, eine Stimme pro Spieler. */
export function VotingPhase() {
  const { state, dispatch } = useGame();
  const round = state.round!;
  const myVote = round.votes[HUMAN_ID];
  const voteCount = Object.keys(round.votes).length;
  const allVoted = voteCount === state.players.length;

  // Demo-Spieler stimmen zeitversetzt ab.
  // Später: Stimmen kommen stattdessen über syncAdapter aus dem Netz.
  useEffect(() => {
    const timers = state.players
      .filter((p) => p.isBot)
      .map((bot, i) =>
        window.setTimeout(() => {
          dispatch({ type: 'CAST_VOTE', voterId: bot.id, targetId: botVote(bot, state.players) });
        }, 1500 + i * 1200 + Math.random() * 800),
      );
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sobald alle Stimmen da sind, wird die Runde aufgelöst.
  useEffect(() => {
    if (!allVoted) return;
    const t = window.setTimeout(() => dispatch({ type: 'RESOLVE_ROUND' }), 1200);
    return () => window.clearTimeout(t);
  }, [allVoted, dispatch]);

  return (
    <Screen>
      <div className="space-y-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-wiz-300">
            Runde {round.number} · Abstimmung
          </p>
          <h1 className="text-3xl font-black text-wiz-200">Wer blufft?</h1>
          <p className="mt-1 text-wiz-200/70">
            {myVote ? 'Warte auf die anderen Stimmen …' : 'Tippe auf deinen Verdächtigen.'}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {state.players
            .filter((p) => p.id !== HUMAN_ID)
            .map((p) => {
              const selected = myVote === p.id;
              return (
                <button
                  key={p.id}
                  disabled={!!myVote}
                  onClick={() => dispatch({ type: 'CAST_VOTE', voterId: HUMAN_ID, targetId: p.id })}
                  className={`wiz-card flex flex-col items-center gap-2 !p-5 transition active:scale-95 ${
                    selected
                      ? '!border-fuchsia-400 shadow-glow'
                      : myVote
                        ? 'opacity-40'
                        : 'hover:border-wiz-400'
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wiz-600 text-xl font-bold">
                    {p.name.charAt(0)}
                  </span>
                  <span className="font-semibold">{p.name}</span>
                  {selected && <span className="text-xs text-fuchsia-300">Dein Verdacht</span>}
                </button>
              );
            })}
        </div>

        <div className="wiz-card text-center">
          <p className="text-sm text-wiz-300">
            Stimmen abgegeben:{' '}
            <span className="font-bold text-crystal">
              {voteCount} / {state.players.length}
            </span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-wiz-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-wiz-500 to-crystal transition-all duration-500"
              style={{ width: `${(voteCount / state.players.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Screen>
  );
}
