import React from 'react';

import '../App.css';
import GameCanvas from './GameCanvas';
import GameControls from './GameControls';
import { useGameMapModel } from '../game';

function App() {
  const gameMap = useGameMapModel()

  return (
    <div className="App">
      <GameCanvas gameMap={gameMap} />
      <GameControls gameMap={gameMap} />
    </div>
  );
}

export default App;
