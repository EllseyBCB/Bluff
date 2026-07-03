import { useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import type { CategoryChoice } from '../types';

const DEMO_NAMES = ['Mika', 'Luca', 'Anna', 'Samir', 'Leon', 'Emma', 'Noah'];
const CATEGORY_OPTIONS: CategoryChoice[] = ['Alltag', 'Fantasy', 'Tiere', 'Essen', 'Schule', 'Zufall'];

/** Kleine Hilfskomponente: eine Reihe auswählbarer Options-Chips. */
function OptionRow<T extends string | number>(props: {
  label: string;
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-wiz-300">{props.label}</p>
      <div className="flex flex-wrap gap-2">
        {props.options.map((opt) => (
          <button
            key={String(opt)}
            onClick={() => props.onSelect(opt)}
            className={`min-w-12 rounded-lg px-4 py-2.5 font-semibold transition active:scale-95 ${
              props.value === opt
                ? 'bg-wiz-500 text-white shadow-glow-sm'
                : 'border border-wiz-600/60 bg-wiz-900/60 text-wiz-200/70'
            }`}
          >
            {String(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Lobby: Name, Lobby-Code, Spielerliste und Spieleinstellungen. */
export function Lobby() {
  const { state, dispatch } = useGame();
  const { settings } = state;

  // Vorschau der Runde: menschlicher Spieler + Demo-Spieler bis zur gewählten Anzahl.
  const previewPlayers = [
    state.playerName.trim() || 'Du',
    ...DEMO_NAMES.slice(0, settings.playerCount - 1),
  ];

  return (
    <Screen>
      <div className="space-y-5">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-wiz-200">Lobby</h1>
          <button className="text-sm text-wiz-300/70 underline" onClick={() => dispatch({ type: 'RESET' })}>
            Verlassen
          </button>
        </header>

        {/* Lobby-Code – später der Schlüssel zum Online-Beitritt */}
        <div className="wiz-card text-center">
          <p className="text-sm text-wiz-300">Lobby-Code</p>
          <p className="text-4xl font-black tracking-[0.35em] text-crystal drop-shadow">
            {state.lobbyCode}
          </p>
          <p className="mt-1 text-xs text-wiz-300/60">Teile den Code mit deinen Freunden</p>
        </div>

        <div className="wiz-card space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-wiz-300" htmlFor="player-name">
              Dein Spielername
            </label>
            <input
              id="player-name"
              className="input-field"
              placeholder="z. B. Zauberin Zoe"
              maxLength={16}
              value={state.playerName}
              onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', name: e.target.value })}
            />
          </div>

          <OptionRow
            label="Spieleranzahl"
            options={[4, 5, 6, 7, 8]}
            value={settings.playerCount}
            onSelect={(v) => dispatch({ type: 'UPDATE_SETTINGS', settings: { playerCount: v } })}
          />
          <OptionRow
            label="Bluffer"
            options={[1, 2]}
            value={settings.blufferCount}
            onSelect={(v) => dispatch({ type: 'UPDATE_SETTINGS', settings: { blufferCount: v } })}
          />
          <OptionRow
            label="Runden"
            options={[3, 5, 7]}
            value={settings.totalRounds}
            onSelect={(v) => dispatch({ type: 'UPDATE_SETTINGS', settings: { totalRounds: v } })}
          />
          <OptionRow
            label="Kategorie"
            options={CATEGORY_OPTIONS}
            value={settings.category}
            onSelect={(v) => dispatch({ type: 'UPDATE_SETTINGS', settings: { category: v } })}
          />
        </div>

        {/* Spielerliste – später live über syncAdapter.onPlayersChanged() */}
        <div className="wiz-card">
          <p className="mb-3 text-sm font-semibold text-wiz-300">
            Spieler ({previewPlayers.length})
          </p>
          <ul className="space-y-2">
            {previewPlayers.map((name, i) => (
              <li
                key={name + i}
                className="flex items-center gap-3 rounded-lg bg-wiz-900/60 px-4 py-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wiz-600 text-sm font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium">{name}</span>
                {i === 0 ? (
                  <span className="ml-auto rounded bg-crystal/20 px-2 py-0.5 text-xs text-crystal">Du</span>
                ) : (
                  <span className="ml-auto rounded bg-wiz-600/40 px-2 py-0.5 text-xs text-wiz-300/70">Demo</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button className="btn-primary" onClick={() => dispatch({ type: 'START_GAME' })}>
          🪄 Spiel starten
        </button>
      </div>
    </Screen>
  );
}
