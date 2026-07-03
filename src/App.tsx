import { GameProvider, useGame } from './state/GameContext';
import { StartScreen } from './components/StartScreen';
import { Lobby } from './components/Lobby';
import { RoleReveal } from './components/RoleReveal';
import { DiscussionPhase } from './components/DiscussionPhase';
import { VotingPhase } from './components/VotingPhase';
import { RevealPhase } from './components/RevealPhase';
import { ScoreBoard } from './components/ScoreBoard';
import { GameOver } from './components/GameOver';

/** Rendert je nach Spielphase den passenden Screen. */
function PhaseRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'start':
      return <StartScreen />;
    case 'lobby':
      return <Lobby />;
    case 'roleReveal':
      return <RoleReveal />;
    case 'discussion':
      return <DiscussionPhase />;
    case 'voting':
      return <VotingPhase />;
    case 'reveal':
      return <RevealPhase />;
    case 'scoreboard':
      return <ScoreBoard />;
    case 'gameOver':
      return <GameOver />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <PhaseRouter />
    </GameProvider>
  );
}
