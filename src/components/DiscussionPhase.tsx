import { useEffect, useRef, useState } from 'react';
import { HUMAN_ID, useGame } from '../state/GameContext';
import { Screen } from './ui/Screen';
import { botStatement, EXAMPLE_STATEMENTS } from '../data/statements';

const DISCUSSION_SECONDS = 60;

/**
 * Diskussionsphase: 60-Sekunden-Timer, jeder Spieler gibt eine kurze
 * Aussage ab. Die Demo-Spieler antworten zeitversetzt automatisch.
 */
export function DiscussionPhase() {
  const { state, dispatch } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(DISCUSSION_SECONDS);
  const [draft, setDraft] = useState('');
  const timersRef = useRef<number[]>([]);

  const round = state.round!;
  const me = state.players.find((p) => p.id === HUMAN_ID)!;
  const said = (id: string) => round.statements.some((s) => s.playerId === id);
  const allSaid = state.players.every((p) => said(p.id));

  // Countdown-Timer; bei 0 geht es automatisch zur Abstimmung.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'BEGIN_VOTING' });
  }, [secondsLeft, dispatch]);

  // Demo-Spieler geben ihre Aussagen zeitversetzt ab (simuliert echte Mitspieler).
  useEffect(() => {
    state.players
      .filter((p) => p.isBot)
      .forEach((bot, i) => {
        const delay = 2500 + i * 4000 + Math.random() * 2000;
        const timer = window.setTimeout(() => {
          const already = round.statements.map((s) => s.text);
          dispatch({
            type: 'ADD_STATEMENT',
            playerId: bot.id,
            text: botStatement(bot, round.category, already),
          });
        }, delay);
        timersRef.current.push(timer);
      });
    return () => timersRef.current.forEach((t) => window.clearTimeout(t));
    // Nur einmal beim Betreten der Phase planen:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sind alle Aussagen da, kurz warten und dann zur Abstimmung wechseln.
  useEffect(() => {
    if (!allSaid) return;
    const t = window.setTimeout(() => dispatch({ type: 'BEGIN_VOTING' }), 2500);
    return () => window.clearTimeout(t);
  }, [allSaid, dispatch]);

  function submitStatement() {
    const text = draft.trim();
    if (!text) return;
    dispatch({ type: 'ADD_STATEMENT', playerId: HUMAN_ID, text });
    setDraft('');
  }

  const timerColor =
    secondsLeft > 20 ? 'text-crystal' : secondsLeft > 10 ? 'text-gold' : 'text-red-400';

  return (
    <Screen>
      <div className="space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-wiz-300">
              Runde {round.number} · Diskussion
            </p>
            <h1 className="text-2xl font-black text-wiz-200">
              Kategorie: <span className="text-fuchsia-300">{round.category}</span>
            </h1>
          </div>
          <div className={`text-4xl font-black tabular-nums ${timerColor}`}>{secondsLeft}</div>
        </header>

        {/* Eigene Aussage eingeben */}
        {!said(HUMAN_ID) ? (
          <div className="wiz-card space-y-3">
            <label className="block text-sm font-semibold text-wiz-300" htmlFor="statement">
              Deine Aussage zum Wort
            </label>
            <textarea
              id="statement"
              className="input-field min-h-20 resize-none"
              maxLength={120}
              placeholder="Sag etwas, das zeigt, dass du das Wort kennst …"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="btn-primary" disabled={!draft.trim()} onClick={submitStatement}>
              Aussage abgeben
            </button>

            <div>
              <p className="mb-2 text-xs text-wiz-300/70">Beispiele zum Antippen:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_STATEMENTS.map((ex) => (
                  <button
                    key={ex}
                    className="rounded-full border border-wiz-600/60 bg-wiz-900/60 px-3 py-1.5 text-xs text-wiz-200/80 active:scale-95"
                    onClick={() => setDraft(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="wiz-card text-center text-wiz-200/80">
            ✅ Deine Aussage ist drin – hör gut zu, wer verdächtig klingt …
          </div>
        )}

        {/* Aussagen erscheinen nacheinander */}
        <div className="space-y-2">
          {round.statements.map((s) => {
            const player = state.players.find((p) => p.id === s.playerId)!;
            return (
              <div key={s.playerId} className="wiz-card animate-fade-up !p-4">
                <p className="mb-1 text-sm font-bold text-wiz-300">
                  {player.name}
                  {player.id === HUMAN_ID && ' (Du)'}
                </p>
                <p className="text-wiz-100/90">„{s.text}“</p>
              </div>
            );
          })}
          {!allSaid && (
            <p className="py-2 text-center text-sm text-wiz-300/60">
              {round.statements.length} von {state.players.length} Aussagen …
            </p>
          )}
        </div>

        {said(HUMAN_ID) && (
          <button className="btn-secondary" onClick={() => dispatch({ type: 'BEGIN_VOTING' })}>
            Direkt zur Abstimmung →
          </button>
        )}
      </div>
    </Screen>
  );
}
