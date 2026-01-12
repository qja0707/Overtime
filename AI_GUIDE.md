# AI Guide

## Coding Style Rules

- Prefer named constants over magic numbers (e.g., `RISK_STACK`, `RISK_XP`, `UPKEEP_PER_MIN`).
- When updating multiple related fields from the same object, prefer destructuring (e.g., `let { safeXP, riskXP, riskStack, upkeepPerMin } = state.run;`).
