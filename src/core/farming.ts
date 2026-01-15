import type { GameState } from './state';

export function startFarming(state: GameState): GameState {
  if (state.run.isRunning || state.farming.isFarming) {
    return state;
  }

  return {
    ...state,
    farming: {
      ...state.farming,
      isFarming: true,
      remainingSec: state.farming.durationSec
    }
  };
}

export function tickFarming(state: GameState, dtSec: number): GameState {
  if (!state.farming.isFarming) {
    return state;
  }

  const nextRemaining = Math.max(0, state.farming.remainingSec - dtSec);
  if (nextRemaining > 0) {
    return {
      ...state,
      farming: {
        ...state.farming,
        remainingSec: nextRemaining
      }
    };
  }

  return {
    ...state,
    gold: state.gold + state.farming.rewardGold,
    farming: {
      ...state.farming,
      isFarming: false,
      remainingSec: 0
    }
  };
}

export function cancelFarming(state: GameState): GameState {
  if (!state.farming.isFarming && state.farming.remainingSec === 0) {
    return state;
  }

  return {
    ...state,
    farming: {
      ...state.farming,
      isFarming: false,
      remainingSec: 0
    }
  };
}
