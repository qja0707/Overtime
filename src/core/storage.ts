import { GameState, initialGameState } from './state';

const STORAGE_KEY = 'overtime.gameState';

export function loadGameState(): GameState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialGameState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialGameState;
    }
    const parsed = JSON.parse(raw) as GameState;
    return {
      ...initialGameState,
      ...parsed,
      meta: {
        ...initialGameState.meta,
        ...parsed.meta
      },
      run: {
        ...initialGameState.run,
        ...parsed.run
      }
    };
  } catch {
    return initialGameState;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures (quota, private mode, etc.).
  }
}
