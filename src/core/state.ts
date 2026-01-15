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
  farming: {
    isFarming: boolean;
    remainingSec: number;
    rewardGold: number;
    durationSec: number;
  };
};

const DEFAULT_ENTRY_FEE = 1;
const DEFAULT_FARM_REWARD_GOLD = 100;
const DEFAULT_FARM_DURATION_SEC = 30;

export const createInitialRunState = (): RunState => ({
  isRunning: false,
  timeSec: 0,
  safeXP: 0,
  riskXP: 0,
  riskStack: 0,
  upkeepPerMin: 0,
  entryFee: DEFAULT_ENTRY_FEE
});

export const createInitialState = (): GameState => ({
  gold: 0,
  meta: {
    permanentXP: 0
  },
  run: createInitialRunState(),
  farming: {
    isFarming: false,
    remainingSec: 0,
    rewardGold: DEFAULT_FARM_REWARD_GOLD,
    durationSec: DEFAULT_FARM_DURATION_SEC
  }
});

export const isBankrupt = (state: GameState): boolean => state.gold < 0;

export const initialGameState: GameState = createInitialState();
