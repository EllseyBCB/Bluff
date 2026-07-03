import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';

/** Auflösung: Bluffer, geheimes Wort, Abstimmungsergebnis und Rundensieger. */
export function RevealPhase() {
  const { state, dispatch } = useGame();
  const round = state.round!;
  const result = state.lastResult!;

  const bluffers = state.players.filter((p) => p.role === 'bluffer');
  const mostVoted = state.players.filter((p) => result.mostVotedIds.includes(p.id));

  // Stimmen pro Spieler zählen (für die Ergebnis-Anzeige).
  const tally: Record<string, number> = {};
  Object.values(round.votes).forEach((id) => (tally[id] = (tally[id] ?? 0) + 1));

  return (
    <Screen>
      <div className="space-y-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-wiz-300">
            Runde {round.number} · Auflösung
          </p>
          <h1 className="text-3xl font-black text-wiz-200">
            {result.blufferCaught ? '🔮 Bluffer enttarnt!' : '🎭 Der Bluff ist gelungen!'}
          </h1>
        </header>

        {/* Gewinner der Runde */}
        <div
          className={`wiz-card text-center ${
            result.blufferCaught ? '!border-crystal/60 shadow-crystal' : '!border-fuchsia-500/60 shadow-glow'
          }`}
        >
          <p className="text-lg font-bold">
            {result.blufferCaught
              ? 'Die normalen Spieler gewinnen diese Runde! (+1 Punkt)'
              : `Die Bluffer gewinnen diese Runde! (+2 Punkte)`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="wiz-card text-center">
            <p className="text-sm text-wiz-300">
              {bluffers.length > 1 ? 'Die Bluffer waren' : 'Der Bluffer war'}
            </p>
            <p className="text-xl font-black text-fuchsia-300">
              {bluffers.map((b) => (b.id === HUMAN_ID ? `${b.name} (Du!)` : b.name)).join(' & ')}
            </p>
          </div>
          <div className="wiz-card text-center">
            <p className="text-sm text-wiz-300">Das geheime Wort</p>
            <p className="text-xl font-black text-crystal">{round.word}</p>
          </div>
        </div>

        <div className="wiz-card text-center">
          <p className="text-sm text-wiz-300">Die meisten Stimmen bekam</p>
          <p className="text-xl font-black text-wiz-100">
            {mostVoted.map((p) => p.name).join(' & ') || '–'}
          </p>
        </div>

        {/* Abstimmungsdetails */}
        <div className="wiz-card">
          <p className="mb-3 text-sm font-semibold text-wiz-300">Alle Stimmen</p>
          <ul className="space-y-1.5 text-sm">
            {state.players.map((p) => {
              const votes = tally[p.id] ?? 0;
              return (
                <li key={p.id} className="flex items-center justify-between">
                  <span>
                    {p.name}
                    {p.role === 'bluffer' && <span className="ml-1 text-fuchsia-300">🎭</span>}
                  </span>
                  <span className="font-bold text-wiz-200">
                    {votes} {votes === 1 ? 'Stimme' : 'Stimmen'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <button className="btn-primary" onClick={() => dispatch({ type: 'SHOW_SCOREBOARD' })}>
          Zum Punktestand
        </button>
      </div>
    </Screen>
  );
}
