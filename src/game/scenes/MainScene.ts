import { Scene } from 'phaser';
import { initialGameState } from '@/core/state';
import { startRun, tick, escapeRun, dieRun } from '@/core/risk';
import { loadGameState, saveGameState } from '@/core/storage';

export class MainScene extends Scene {
  private state = initialGameState;
  private hudText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.state = loadGameState();
    this.hudText = this.add.text(16, 16, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#e6f0ff'
    });

    this.input.keyboard?.on('keydown-S', () => {
      if (this.state.run.isRunning) {
        return;
      }
      this.state = startRun(this.state);
      saveGameState(this.state);
    });

    this.input.keyboard?.on('keydown-E', () => {
      if (!this.state.run.isRunning) {
        return;
      }
      this.state = escapeRun(this.state);
      saveGameState(this.state);
      this.scene.start('MainMenu');
    });

    this.input.keyboard?.on('keydown-K', () => {
      if (!this.state.run.isRunning) {
        return;
      }
      this.state = dieRun(this.state);
      saveGameState(this.state);
      this.scene.start('MainMenu');
    });
  }

  update(_time: number, delta: number): void {
    this.state = tick(this.state, delta / 1000);

    const { run, meta } = this.state;
    this.hudText.setText([
      `Survival Time: ${formatTime(run.timeSec)}`,
      `Safe XP: ${run.safeXP}`,
      `Risk XP: ${run.riskXP}`,
      `Risk Stack: ${run.riskStack}`,
      `Upkeep / Min: ${run.upkeepPerMin}`,
      `Permanent XP: ${meta.permanentXP}`
    ]);
  }
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
