# AI Guide

## Coding Style Rules

- Prefer named constants over magic numbers (e.g., `RISK_STACK`, `RISK_XP`, `UPKEEP_PER_MIN`).
- When updating multiple related fields from the same object, prefer destructuring (e.g., `let { safeXP, riskXP, riskStack, upkeepPerMin } = state.run;`).

Do not create new parallel state models or rename files.
Do not change existing architecture.
Make minimal diffs to current files only.
Implement ONLY the requested behavior and nothing else.
If you need to store/load, use the existing state object as-is.
