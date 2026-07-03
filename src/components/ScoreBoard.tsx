import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';

/** Punktetabelle nach jeder Runde, sortiert nach Punktestand. */
export function ScoreBoard() {
  const { state, dispatch } = useGame();
  const round = state.round!;
  const isLastRound = round.number >= state.settings.totalRounds;

  const sorted = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <Screen>
      <div className="space-y-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-wiz-300">
            Nach Runde {round.number} von {state.settings.totalRounds}
          </p>
          <h1 className="text-3xl font-black text-wiz-200">💎 Punktestand</h1>
        </header>

        <div className="wiz-card !p-0">
          <ul className="divide-y divide-wiz-600/30">
            {sorted.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={`w-7 text-center text-lg font-black ${
                    i === 0 ? 'text-gold' : 'text-wiz-300/60'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wiz-600 font-bold">
                  {p.name.charAt(0)}
                </span>
                <span className="font-semibold">
                  {p.name}
                  {p.id === HUMAN_ID && <span className="ml-1 text-xs text-crystal">(Du)</span>}
                </span>
                <span className="ml-auto text-xl font-black text-wiz-200">
                  {p.score} <span className="text-sm font-normal text-wiz-300/60">Pkt.</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isLastRound ? (
          <button className="btn-primary" onClick={() => dispatch({ type: 'SHOW_GAME_OVER' })}>
            🏆 Endstand ansehen
          </button>
        ) : (
          <button className="btn-primary" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
            Nächste Runde ({round.number + 1}/{state.settings.totalRounds})
          </button>
        )}
      </div>
    </Screen>
  );
}
