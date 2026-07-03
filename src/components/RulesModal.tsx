/** Regel-Übersicht als Overlay, erreichbar vom Startbildschirm. */
export function RulesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="wiz-card max-h-[85dvh] w-full max-w-md overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-wiz-200">📜 Spielregeln</h2>
        <ol className="space-y-3 text-wiz-100/90">
          <li>
            <strong className="text-wiz-300">1. Rollen:</strong> Alle Spieler bekommen geheim eine
            Rolle. Normale Spieler kennen das geheime Wort – Bluffer sehen nur die Kategorie und
            einen vagen Hinweis.
          </li>
          <li>
            <strong className="text-wiz-300">2. Diskussion:</strong> Jeder gibt eine kurze Aussage
            zum Wort ab. Normale Spieler deuten es an, ohne es zu verraten. Bluffer tun so, als
            wüssten sie Bescheid.
          </li>
          <li>
            <strong className="text-wiz-300">3. Abstimmung:</strong> Alle stimmen ab, wer der
            Bluffer ist. Jeder hat genau eine Stimme.
          </li>
          <li>
            <strong className="text-wiz-300">4. Auflösung:</strong> Bekommt ein Bluffer die meisten
            Stimmen, gewinnen die normalen Spieler (+1 Punkt). Bleibt der Bluffer unentdeckt,
            gewinnt er (+2 Punkte).
          </li>
          <li>
            <strong className="text-wiz-300">5. Sieg:</strong> Nach der letzten Runde gewinnt, wer
            die meisten Punkte gesammelt hat.
          </li>
        </ol>
        <button className="btn-primary mt-6" onClick={onClose}>
          Verstanden
        </button>
      </div>
    </div>
  );
}
