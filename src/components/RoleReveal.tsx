import { useState } from 'react';
import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import { Crystal } from './ui/Crystal';

/**
 * Rollenverteilung: Die eigene Rollenkarte ist zunächst verdeckt und
 * wird erst per Tipp aufgedeckt (3D-Flip), damit niemand sie aus
 * Versehen sieht. Demo-Spieler "kennen" ihre Rollen automatisch.
 */
export function RoleReveal() {
  const { state, dispatch } = useGame();
  const [revealed, setRevealed] = useState(false);

  const me = state.players.find((p) => p.id === HUMAN_ID);
  const round = state.round;
  if (!me || !round) return null;

  const isBluffer = me.role === 'bluffer';

  return (
    <Screen>
      <div className="flex min-h-[80dvh] flex-col justify-center gap-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-wiz-300">
            Runde {round.number} von {state.settings.totalRounds}
          </p>
          <h1 className="mt-1 text-3xl font-black text-wiz-200">Deine geheime Rolle</h1>
          <p className="mt-2 text-wiz-200/70">
            Tippe auf die Karte, um sie aufzudecken. Zeig sie niemandem!
          </p>
        </header>

        {/* Flip-Karte */}
        <div className="perspective-1000 mx-auto h-80 w-64">
          <button
            className={`preserve-3d relative h-full w-full transition-transform duration-700 ${
              revealed ? 'rotate-y-180' : ''
            }`}
            onClick={() => setRevealed(true)}
            aria-label="Rollenkarte aufdecken"
          >
            {/* Rückseite (verdeckt) */}
            <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-wiz-500/60 bg-gradient-to-br from-wiz-700 to-wiz-900 shadow-glow">
              <Crystal className="h-16 w-16 animate-sparkle" />
              <p className="text-lg font-bold text-wiz-200">Tippen zum Aufdecken</p>
            </div>

            {/* Vorderseite (Rolle) */}
            <div
              className={`backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 text-center ${
                isBluffer
                  ? 'border-fuchsia-500/70 bg-gradient-to-br from-fuchsia-950 to-wiz-900 shadow-glow'
                  : 'border-crystal/60 bg-gradient-to-br from-wiz-800 to-wiz-950 shadow-crystal'
              }`}
            >
              <span className="text-5xl">{isBluffer ? '🎭' : '🧙'}</span>
              <p className="text-xl font-black text-wiz-100">
                {isBluffer ? 'Du bist der BLUFFER' : 'Normaler Spieler'}
              </p>
              {isBluffer ? (
                <>
                  <p className="text-sm text-wiz-200/80">
                    Du kennst das Wort nicht. Kategorie:
                    <span className="mt-1 block text-lg font-bold text-fuchsia-300">
                      {round.category}
                    </span>
                  </p>
                  <p className="rounded-lg bg-wiz-900/70 px-3 py-2 text-sm italic text-wiz-200/80">
                    Hinweis: {round.hint}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-wiz-200/80">Das geheime Wort lautet:</p>
                  <p className="rounded-lg bg-wiz-900/70 px-4 py-2 text-2xl font-black text-crystal">
                    {round.word}
                  </p>
                </>
              )}
            </div>
          </button>
        </div>

        <button
          className="btn-primary"
          disabled={!revealed}
          onClick={() => dispatch({ type: 'BEGIN_DISCUSSION' })}
        >
          {revealed ? 'Diskussion starten' : 'Erst Karte aufdecken …'}
        </button>
      </div>
    </Screen>
  );
}
