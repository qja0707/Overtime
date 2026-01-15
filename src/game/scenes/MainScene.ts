import { Scene } from 'phaser';
import { initialGameState } from '@/core/state';
import { startRun, tick, escapeRun, dieRun } from '@/core/risk';
import { loadGameState, saveGameState } from '@/core/storage';

export class MainScene extends Scene {
  private state = initialGameState;
  private hudText!: Phaser.GameObjects.Text;
  private lastAutosaveMs = 0;

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

    const startRunAction = () => {
      if (this.state.run.isRunning) {
        return;
      }
      this.state = startRun(this.state);
      saveGameState(this.state);
    };

    const escapeRunAction = () => {
      if (!this.state.run.isRunning) {
        return;
      }
      this.state = escapeRun(this.state);
      saveGameState(this.state);
      this.scene.start('MainMenu');
    };

    const dieRunAction = () => {
      if (!this.state.run.isRunning) {
        return;
      }
      this.state = dieRun(this.state);
      saveGameState(this.state);
      this.scene.start('MainMenu');
    };

    this.add
      .text(16, 160, 'Start (S)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', startRunAction);

    this.add
      .text(16, 190, 'Escape (E)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', escapeRunAction);

    this.add
      .text(16, 220, 'Die (K)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', dieRunAction);

    this.input.keyboard?.on('keydown-S', startRunAction);
    this.input.keyboard?.on('keydown-E', escapeRunAction);
    this.input.keyboard?.on('keydown-K', dieRunAction);
  }

  update(time: number, delta: number): void {
    this.state = tick(this.state, delta / 1000);
    if (this.state.run.isRunning && time - this.lastAutosaveMs >= 5000) {
      saveGameState(this.state);
      this.lastAutosaveMs = time;
    }

    const { run, meta } = this.state;
    const lines = [
      `Survival Time: ${formatTime(run.timeSec)}`,
      `Gold: ${this.state.gold}`,
      `Safe XP: ${run.safeXP}`,
      `Risk XP: ${run.riskXP}`,
      `Risk Stack: ${run.riskStack}`,
      `Upkeep / Min: ${run.upkeepPerMin}`,
      `Permanent XP: ${meta.permanentXP}`
    ];
    if (this.state.gold < 0) {
      lines.unshift('⚠ Bankrupt: Safe/Risk gains frozen');
    }
    this.hudText.setText(lines);
  }
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
