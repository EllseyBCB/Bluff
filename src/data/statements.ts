import type { Category, Player } from '../types';

/**
 * Aussagen-Vorlagen für die simulierten Demo-Spieler und als
 * Beispiel-Vorschläge für den menschlichen Spieler.
 *
 * Normale Spieler deuten das Wort vage an, Bluffer bleiben bewusst schwammig.
 */

const CITIZEN_BY_CATEGORY: Record<Category, string[]> = {
  Tiere: [
    'Ich hab sofort ein Bild im Kopf, wie es sich bewegt.',
    'Ich glaube, ich hab so eins schon mal in echt gesehen.',
    'Als Kind fand ich es viel spannender als heute.',
    'Ich müsste kurz überlegen, welches Geräusch es macht.',
  ],
  Essen: [
    'Davon könnte ich gerade wirklich etwas vertragen.',
    'Ich weiß genau, wo es das in meiner Nähe am besten gibt.',
    'Selbst gemacht schmeckt es nochmal ganz anders.',
    'Beim letzten Mal hab ich definitiv zu viel davon gehabt.',
  ],
  Fantasy: [
    'In Filmen wird es meistens falsch dargestellt, finde ich.',
    'Ich fände es ehrlich gesagt ziemlich cool, eins zu haben.',
    'Das würde ich nachts lieber nicht treffen.',
    'Dazu fällt mir sofort eine bestimmte Geschichte ein.',
  ],
  Alltag: [
    'Ohne das läuft bei mir morgens gar nichts.',
    'Ich hab meins erst letzte Woche wieder gesucht.',
    'Meine Eltern gehen damit ganz anders um als ich.',
    'Man merkt erst, wie wichtig es ist, wenn es fehlt.',
  ],
  Schule: [
    'Daran hab ich ziemlich gemischte Erinnerungen.',
    'Bei uns gab es dazu mal eine legendäre Geschichte.',
    'Montags war das immer am schlimmsten.',
    'Manche Lehrer waren da deutlich entspannter als andere.',
  ],
};

/** Bluffer kennen das Wort nicht – sie reden sich raus. */
const BLUFFER_LINES: string[] = [
  'Ja, das kenne ich natürlich – wer nicht?',
  'Ich hatte da erst neulich wieder so eine Situation …',
  'Schwer zu beschreiben, aber ihr wisst schon, was ich meine.',
  'Ich sag mal so: Es ist genau das, was man erwartet.',
  'Da denke ich sofort an meine Kindheit zurück.',
  'Ich halte mich mal bewusst kurz, sonst verrate ich zu viel.',
];

/** Beispiel-Aussagen, die dem menschlichen Spieler als Inspiration angezeigt werden. */
export const EXAMPLE_STATEMENTS: string[] = [
  'Ich benutze es öfter, als ich zugeben möchte.',
  'Meine Oma hätte dazu eine klare Meinung.',
  'Im Sommer ist es was ganz anderes als im Winter.',
  'Ich verbinde damit einen ganz bestimmten Geruch.',
  'Darüber hab ich letztens erst mit Freunden geredet.',
];

function pick(pool: string[], exclude: string[]): string {
  const fresh = pool.filter((s) => !exclude.includes(s));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(Math.random() * source.length)];
}

/** Erzeugt eine Aussage für einen Demo-Spieler, passend zu seiner Rolle. */
export function botStatement(player: Player, category: Category, alreadySaid: string[]): string {
  const pool = player.role === 'bluffer' ? BLUFFER_LINES : CITIZEN_BY_CATEGORY[category];
  return pick(pool, alreadySaid);
}
