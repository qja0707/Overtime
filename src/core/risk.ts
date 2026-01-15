import type { GameState, RunState } from './state';

const SECONDS_PER_MINUTE = 60;
const RISK_START_SECONDS = 180;

const RISK_STACK = 1;
const RISK_XP = 2;
const UPKEEP_PER_MIN = 2;

export function startRun(state: GameState): GameState {
  const baseUpkeep = state.run.upkeepPerMin > 0 ? state.run.upkeepPerMin : 1;
  const nextRun: RunState = {
    isRunning: true,
    timeSec: 0,
    safeXP: 0,
    riskXP: 0,
    riskStack: 0,
    upkeepPerMin: baseUpkeep,
    entryFee:state.run.entryFee
  };

  return { ...state, run: nextRun };
}

export function tick(state: GameState, dtSec: number): GameState {
  if (!state.run.isRunning || dtSec <= 0) {
    return state;
  }

  const prevTime = state.run.timeSec;
  const nextTime = prevTime + dtSec;
  const prevSeconds = Math.floor(prevTime);
  const nextSeconds = Math.floor(nextTime);
  const prevMinutes = Math.floor(prevTime / SECONDS_PER_MINUTE);
  const nextMinutes = Math.floor(nextTime / SECONDS_PER_MINUTE);

  let {safeXP, riskXP, riskStack, upkeepPerMin} = state.run;

  const gold = state.gold;

  if (nextSeconds > prevSeconds && gold > 0) {
    safeXP += nextSeconds - prevSeconds;
  }

  for (let minute = prevMinutes + 1; minute <= nextMinutes; minute += 1) {
    const minuteSeconds = minute * SECONDS_PER_MINUTE;
    if (minuteSeconds >= RISK_START_SECONDS) {
      riskStack += RISK_STACK;
      riskXP += RISK_XP;
      upkeepPerMin *= UPKEEP_PER_MIN;
    }
  }

  return {
    ...state,
    run: {
      ...state.run,
      timeSec: nextTime,
      safeXP,
      riskXP,
      riskStack,
      upkeepPerMin
    }
  };
}

export function escapeRun(state: GameState): GameState {
  if (!state.run.isRunning) {
    return state;
  }

  const earnedXP = state.run.safeXP + state.run.riskXP;

  return {
    ...state,
    meta: {
      ...state.meta,
      permanentXP: state.meta.permanentXP + earnedXP
    },
    run: {
      ...state.run,
      isRunning: false
    }
  };
}

export function dieRun(state: GameState): GameState {
  if (!state.run.isRunning) {
    return state;
  }

  const earnedXP = state.run.safeXP;

  return {
    ...state,
    meta: {
      ...state.meta,
      permanentXP: state.meta.permanentXP + earnedXP
    },
    run: {
      ...state.run,
      isRunning: false
    }
  };
}
