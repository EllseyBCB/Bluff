import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import { Crystal } from './ui/Crystal';

/** Endbildschirm: Gesamtsieger und Möglichkeit zur Revanche. */
export function GameOver() {
  const { state, dispatch } = useGame();

  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const winners = sorted.filter((p) => p.score === topScore);

  return (
    <Screen>
      <div className="flex min-h-[80dvh] flex-col justify-center gap-6">
        <header className="text-center">
          <div className="mb-3 flex justify-center">
            <Crystal className="h-16 w-16 animate-float-slow" />
          </div>
          <h1 className="text-4xl font-black text-wiz-200">Spiel vorbei!</h1>
        </header>

        {/* Sieger-Karte */}
        <div className="wiz-card !border-gold/60 text-center shadow-glow animate-pop-in">
          <p className="text-5xl">🏆</p>
          <p className="mt-2 text-sm uppercase tracking-widest text-wiz-300">
            {winners.length > 1 ? 'Gewinner' : 'Gewinner:in'}
          </p>
          <p className="mt-1 text-3xl font-black text-gold">
            {winners.map((w) => (w.id === HUMAN_ID ? `${w.name} (Du!)` : w.name)).join(' & ')}
          </p>
          <p className="mt-1 text-wiz-200/80">
            mit {topScore} {topScore === 1 ? 'Punkt' : 'Punkten'}
          </p>
        </div>

        {/* Endstand */}
        <div className="wiz-card !p-0">
          <ul className="divide-y divide-wiz-600/30">
            {sorted.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-6 text-center font-black text-wiz-300/60">{i + 1}</span>
                <span className="font-semibold">
                  {p.name}
                  {p.id === HUMAN_ID && <span className="ml-1 text-xs text-crystal">(Du)</span>}
                </span>
                <span className="ml-auto font-black text-wiz-200">{p.score} Pkt.</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button className="btn-primary" onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
            🔁 Nochmal spielen
          </button>
          <button className="btn-secondary" onClick={() => dispatch({ type: 'RESET' })}>
            Zum Startbildschirm
          </button>
        </div>
      </div>
    </Screen>
  );
}
