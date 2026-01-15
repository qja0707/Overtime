export type RunState = {
  isRunning: boolean;
  timeSec: number;
  safeXP: number;
  riskXP: number;
  riskStack: number;
  upkeepPerMin: number;
  entryFee: number;
};

export type GameState = {
  gold: number;
  meta: {
    permanentXP: number;
  };
  run: RunState;
};

export const createInitialRunState = (): RunState => ({
  isRunning: false,
  timeSec: 0,
  safeXP: 0,
  riskXP: 0,
  riskStack: 0,
  upkeepPerMin: 0,
  entryFee: 1
});

export const createInitialState = (): GameState => ({
  gold: 0,
  meta: {
    permanentXP: 0
  },
  run: createInitialRunState()
});

export const isBankrupt = (state: GameState): boolean => state.gold < 0;

export const initialGameState: GameState = createInitialState();
