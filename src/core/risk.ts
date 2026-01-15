import type { GameState, RunState } from './state';

const SECONDS_PER_MINUTE = 60;
const RISK_START_SECONDS = 180;

const RISK_STACK = 1;
const RISK_XP = 2;
const UPKEEP_PER_MIN = 2;

export function startRun(state: GameState): GameState {
  const baseUpkeep = state.run.upkeepPerMin > 0 ? state.run.upkeepPerMin : 1;
  const entryFee = state.run.entryFee;
  const nextRun: RunState = {
    isRunning: true,
    timeSec: 0,
    safeXP: 0,
    riskXP: 0,
    riskStack: 0,
    upkeepPerMin: baseUpkeep,
    entryFee
  };

  return { ...state, gold: state.gold - entryFee, run: nextRun };
}

export function tick(state: GameState, dtSec: number): GameState {
  if (!state.run.isRunning || dtSec <= 0) {
    return state;
  }

  const prevTime = state.run.timeSec;
  const nextTime = prevTime + dtSec;
  const prevMinutes = Math.floor(prevTime / SECONDS_PER_MINUTE);
  const nextMinutes = Math.floor(nextTime / SECONDS_PER_MINUTE);

  let {safeXP, riskXP, riskStack, upkeepPerMin} = state.run;
  let gold = state.gold;

  let segmentStart = prevTime;
  for (let minute = prevMinutes; minute <= nextMinutes; minute += 1) {
    const minuteStart = minute * SECONDS_PER_MINUTE;
    const minuteEnd = minuteStart + SECONDS_PER_MINUTE;
    const segmentEnd = Math.min(nextTime, minuteEnd);
    const gainedSeconds =
      Math.max(0, Math.floor(segmentEnd) - Math.floor(segmentStart));
    if (gainedSeconds > 0 && gold >= 0) {
      safeXP += gainedSeconds;
    }
    if (minute === nextMinutes) {
      break;
    }

    gold -= upkeepPerMin;
    const nextMinuteStart = minuteEnd;
    if (nextMinuteStart >= RISK_START_SECONDS && gold >= 0) {
      riskStack += RISK_STACK;
      riskXP += RISK_XP;
      upkeepPerMin *= UPKEEP_PER_MIN;
    }
    segmentStart = minuteEnd;
  }

  return {
    ...state,
    gold,
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
