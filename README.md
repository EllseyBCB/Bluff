# 🔮 Wiz Bluff

**Finde heraus, wer blufft – oder täusche alle.**

Ein Online-Bluff-Partyspiel im Fantasy-/Magie-Stil: Kristalle, Zauberer und dunkles Lila.
Diese MVP-Version läuft komplett lokal im Browser – die Mitspieler **Mika, Luca, Anna,
Samir und Leon** werden simuliert, sodass du sofort ohne echte Online-Spieler testen kannst.

## 🚀 Starten & Testen

Voraussetzung: [Node.js](https://nodejs.org) (Version 18 oder neuer).

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Entwicklungsserver starten
```

Danach öffnet sich die App unter **http://localhost:5173** (Vite zeigt die URL im Terminal).
Auf dem Handy im gleichen WLAN testen: `npm run dev -- --host` und die angezeigte
Netzwerk-IP aufrufen.

Produktions-Build:

```bash
npm run build   # TypeScript-Check + optimierter Build nach dist/
npm run preview # Build lokal ansehen
```

## 🎮 So funktioniert das Spiel

1. **Spiel erstellen** → Lobby mit Code, Name eingeben, Einstellungen wählen
   (4–8 Spieler, 1–2 Bluffer, 3/5/7 Runden, Kategorie).
2. **Rollenkarte aufdecken** – normale Spieler sehen das geheime Wort,
   Bluffer nur die Kategorie und einen vagen Hinweis.
3. **Diskussion** (60 Sekunden) – jeder gibt eine kurze Aussage ab.
4. **Abstimmung** – wer ist der Bluffer?
5. **Auflösung & Punkte** – Bluffer enttarnt: normale Spieler +1 Punkt.
   Bluffer unentdeckt: Bluffer +2 Punkte.
6. Nach der letzten Runde gewinnt, wer die meisten Punkte hat.

## 🧱 Technik

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (eigene Lila-/Kristall-Farbwelt in `tailwind.config.js`)
- Zentraler Game-State über React Context + Reducer (`src/state/GameContext.tsx`)
- Keine kostenpflichtigen APIs, kein Backend nötig

### Projektstruktur

```
src/
├── components/        # Ein Screen pro Spielphase
│   ├── StartScreen.tsx
│   ├── Lobby.tsx
│   ├── RoleReveal.tsx
│   ├── DiscussionPhase.tsx
│   ├── VotingPhase.tsx
│   ├── RevealPhase.tsx
│   ├── ScoreBoard.tsx
│   ├── GameOver.tsx
│   └── ui/            # Wiederverwendbare Bausteine (Kristalle, Layout)
├── data/
│   ├── words.ts       # 40 geheime Wörter mit Kategorien & Bluffer-Hinweisen
│   └── statements.ts  # Aussagen der Demo-Spieler + Beispiel-Vorschläge
├── net/
│   └── SyncAdapter.ts # Schnittstelle für späteres Online-Multiplayer
├── state/
│   └── GameContext.tsx # Zentraler Game-State (Reducer)
└── types.ts
```

## 🌐 Später: Echtes Online-Multiplayer

Die App ist darauf vorbereitet, Firebase, Supabase oder WebSockets zu ergänzen:
`src/net/SyncAdapter.ts` definiert die Schnittstelle (**Lobby erstellen, Lobby
beitreten, Spieler synchronisieren, Stimmen synchronisieren, Rundenstatus
synchronisieren**). Aktuell steckt dahinter ein `LocalAdapter` ohne Backend –
für echtes Multiplayer einfach eine neue Adapter-Implementierung schreiben und
in `syncAdapter` einsetzen. Die relevanten Stellen im Code sind mit
„Später: …“-Kommentaren markiert.
