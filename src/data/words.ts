import type { Category, WordEntry } from '../types';

/**
 * Geheime Wörter mit Kategorie und vagem Hinweis für Bluffer.
 * 40 Wörter, 8 pro Kategorie.
 */
export const WORDS: WordEntry[] = [
  // Tiere
  { word: 'Pinguin', category: 'Tiere', hint: 'Es lebt dort, wo es kalt ist.' },
  { word: 'Löwe', category: 'Tiere', hint: 'Viele haben ein bisschen Angst davor.' },
  { word: 'Katze', category: 'Tiere', hint: 'Man sieht es oft in der Nachbarschaft.' },
  { word: 'Delfin', category: 'Tiere', hint: 'Es ist ohne Wasser aufgeschmissen.' },
  { word: 'Adler', category: 'Tiere', hint: 'Man sieht es meistens von unten.' },
  { word: 'Elefant', category: 'Tiere', hint: 'Es ist ziemlich schwer zu übersehen.' },
  { word: 'Schlange', category: 'Tiere', hint: 'Manche finden es eklig, andere faszinierend.' },
  { word: 'Hamster', category: 'Tiere', hint: 'Es passt in eine Hand.' },

  // Essen
  { word: 'Pizza', category: 'Essen', hint: 'Fast jeder mag es, aber alle anders.' },
  { word: 'Döner', category: 'Essen', hint: 'Man isst es oft unterwegs.' },
  { word: 'Sushi', category: 'Essen', hint: 'Nicht jeder traut sich ran.' },
  { word: 'Schokolade', category: 'Essen', hint: 'Perfekt, wenn man Trost braucht.' },
  { word: 'Burger', category: 'Essen', hint: 'Mit den Händen essen ist erlaubt.' },
  { word: 'Spaghetti', category: 'Essen', hint: 'Es kann beim Essen schmutzig werden.' },
  { word: 'Eis', category: 'Essen', hint: 'Im Sommer besonders beliebt.' },
  { word: 'Pommes', category: 'Essen', hint: 'Die Beilage, die oft die Hauptsache ist.' },

  // Fantasy
  { word: 'Drache', category: 'Fantasy', hint: 'Es ist groß und gefährlich.' },
  { word: 'Zauberstab', category: 'Fantasy', hint: 'Man hält es in der Hand.' },
  { word: 'Kristall', category: 'Fantasy', hint: 'Es glitzert und ist wertvoll.' },
  { word: 'Hexe', category: 'Fantasy', hint: 'In Märchen oft die Böse.' },
  { word: 'Portal', category: 'Fantasy', hint: 'Man geht hindurch und ist woanders.' },
  { word: 'Einhorn', category: 'Fantasy', hint: 'Es gilt als besonders selten.' },
  { word: 'Zaubertrank', category: 'Fantasy', hint: 'Man sollte wissen, was drin ist.' },
  { word: 'Geist', category: 'Fantasy', hint: 'Man sieht es nicht immer.' },

  // Alltag
  { word: 'Handy', category: 'Alltag', hint: 'Fast jeder hat es dabei.' },
  { word: 'Schlüssel', category: 'Alltag', hint: 'Ohne kommt man nicht weit.' },
  { word: 'Auto', category: 'Alltag', hint: 'Es steht oft nur herum.' },
  { word: 'Schule', category: 'Alltag', hint: 'Man verbringt dort viel Zeit.' },
  { word: 'Kaffee', category: 'Alltag', hint: 'Viele brauchen es am Morgen.' },
  { word: 'Fernbedienung', category: 'Alltag', hint: 'Es verschwindet ständig.' },
  { word: 'Regenschirm', category: 'Alltag', hint: 'Man vergisst es genau dann, wenn man es braucht.' },
  { word: 'Kopfhörer', category: 'Alltag', hint: 'Damit ist man in seiner eigenen Welt.' },

  // Schule
  { word: 'Tafel', category: 'Schule', hint: 'Alle schauen darauf.' },
  { word: 'Pausenbrot', category: 'Schule', hint: 'Manchmal wird es getauscht.' },
  { word: 'Hausaufgaben', category: 'Schule', hint: 'Nicht jeder macht es freiwillig.' },
  { word: 'Klassenfahrt', category: 'Schule', hint: 'Darauf freuen sich alle lange.' },
  { word: 'Zeugnis', category: 'Schule', hint: 'Manche zeigen es gern, manche nicht.' },
  { word: 'Turnhalle', category: 'Schule', hint: 'Es riecht dort besonders.' },
  { word: 'Lehrerzimmer', category: 'Schule', hint: 'Man kommt nicht einfach so hinein.' },
  { word: 'Schulhof', category: 'Schule', hint: 'Hier passiert das eigentlich Wichtige.' },
];

export const CATEGORIES: Category[] = ['Alltag', 'Fantasy', 'Tiere', 'Essen', 'Schule'];

/**
 * Wählt ein zufälliges, noch nicht benutztes Wort.
 * Bei Kategorie "Zufall" wird jede Runde eine Kategorie gewürfelt.
 */
export function pickWord(category: Category | 'Zufall', usedWords: string[]): WordEntry {
  const cat: Category =
    category === 'Zufall' ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)] : category;

  let pool = WORDS.filter((w) => w.category === cat && !usedWords.includes(w.word));
  // Fallback: Wenn alle Wörter der Kategorie durch sind, wieder alle erlauben.
  if (pool.length === 0) pool = WORDS.filter((w) => w.category === cat);

  return pool[Math.floor(Math.random() * pool.length)];
}
