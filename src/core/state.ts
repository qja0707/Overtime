export type RunState = {
  isRunning: boolean;
  timeSec: number;
  safeXP: number;
  riskXP: number;
  riskStack: number;
  upkeepPerMin: number;
};

export type GameState = {
  gold: number;
  meta: {
    permanentXP: number;
  };
  run: RunState;
};

export const initialGameState: GameState = {
  gold: 0,
  meta: {
    permanentXP: 0
  },
  run: {
    isRunning: false,
    timeSec: 0,
    safeXP: 0,
    riskXP: 0,
    riskStack: 0,
    upkeepPerMin: 0
  }
};
