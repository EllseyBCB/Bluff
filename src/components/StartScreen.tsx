import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import { Crystal } from './ui/Crystal';
import { RulesModal } from './RulesModal';

/** Startbildschirm: Titel, Beschreibung und Einstieg ins Spiel. */
export function StartScreen() {
  const { dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  return (
    <Screen>
      <div className="flex min-h-[80dvh] flex-col justify-center gap-10">
        <header className="text-center">
          <div className="mb-4 flex justify-center">
            <Crystal className="h-20 w-20 animate-float-slow" />
          </div>
          <h1 className="bg-gradient-to-r from-wiz-300 via-fuchsia-300 to-crystal bg-clip-text text-6xl font-black tracking-tight text-transparent drop-shadow">
            Wiz Bluff
          </h1>
          <p className="mt-3 text-lg text-wiz-200/80">
            Finde heraus, wer blufft – oder täusche alle.
          </p>
        </header>

        <div className="space-y-4">
          <button className="btn-primary" onClick={() => dispatch({ type: 'CREATE_LOBBY' })}>
            ✨ Spiel erstellen
          </button>

          {showJoin ? (
            <div className="wiz-card space-y-3 animate-pop-in">
              <label className="block text-sm font-semibold text-wiz-300" htmlFor="join-code">
                Lobby-Code eingeben
              </label>
              <input
                id="join-code"
                className="input-field text-center text-2xl uppercase tracking-[0.4em]"
                maxLength={5}
                placeholder="ABC12"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <button
                className="btn-primary"
                disabled={joinCode.trim().length < 4}
                onClick={() => dispatch({ type: 'JOIN_LOBBY', code: joinCode.trim() })}
              >
                Beitreten
              </button>
              <p className="text-center text-xs text-wiz-300/60">
                MVP-Hinweis: Die Lobby wird lokal mit Demo-Spielern simuliert.
              </p>
            </div>
          ) : (
            <button className="btn-secondary" onClick={() => setShowJoin(true)}>
              🔮 Spiel beitreten
            </button>
          )}

          <button className="btn-secondary" onClick={() => setShowRules(true)}>
            📜 Regeln ansehen
          </button>
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </Screen>
  );
}
