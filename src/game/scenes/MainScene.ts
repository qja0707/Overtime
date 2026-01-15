import { Scene } from 'phaser';
import { initialGameState } from '@/core/state';
import { startRun, tick, escapeRun, dieRun } from '@/core/risk';
import { loadGameState, saveGameState } from '@/core/storage';
import { startFarming, cancelFarming, tickFarming } from '@/core/farming';

export class MainScene extends Scene {
  private state = initialGameState;
  private hudText!: Phaser.GameObjects.Text;
  private startText!: Phaser.GameObjects.Text;
  private escapeText!: Phaser.GameObjects.Text;
  private dieText!: Phaser.GameObjects.Text;
  private farmText!: Phaser.GameObjects.Text;
  private cancelFarmText!: Phaser.GameObjects.Text;
  private lastAutosaveMs = 0;

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.state = loadGameState();
    if (this.state.farming.isFarming) {
      this.state = cancelFarming(this.state);
      saveGameState(this.state);
    }
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

    this.startText = this.add
      .text(16, 0, 'Start (S)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', startRunAction);

    this.escapeText = this.add
      .text(16, 0, 'Escape (E)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', escapeRunAction);

    this.dieText = this.add
      .text(16, 0, 'Die (K)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', dieRunAction);

    this.farmText = this.add
      .text(16, 0, '', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (this.state.run.isRunning || this.state.farming.isFarming) {
          return;
        }
        this.state = startFarming(this.state);
        saveGameState(this.state);
      });

    this.cancelFarmText = this.add
      .text(16, 0, 'Cancel Farming', {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: '#e6f0ff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (!this.state.farming.isFarming) {
          return;
        }
        this.state = cancelFarming(this.state);
        saveGameState(this.state);
      });

    this.input.keyboard?.on('keydown-S', startRunAction);
    this.input.keyboard?.on('keydown-E', escapeRunAction);
    this.input.keyboard?.on('keydown-K', dieRunAction);
  }

  update(time: number, delta: number): void {
    this.state = tick(this.state, delta / 1000);
    const wasFarming = this.state.farming.isFarming;
    this.state = tickFarming(this.state, delta / 1000);
    if (
      wasFarming &&
      !this.state.farming.isFarming &&
      this.state.farming.remainingSec === 0
    ) {
      saveGameState(this.state);
    }
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
    if (this.state.run.isRunning) {
      lines.push('Cannot farm during a run.');
    }
    if (this.state.farming.isFarming) {
      lines.push('Cannot start a run while farming.');
    }
    if (this.state.farming.isFarming) {
      lines.push(
        'Farming: YES',
        `Time left: ${Math.ceil(this.state.farming.remainingSec)}s`,
        `Reward: +${this.state.farming.rewardGold} Gold`
      );
    } else {
      lines.push('Farming: NO');
    }
    this.hudText.setText(lines);

    const buttonsStartY = this.hudText.y + this.hudText.height + 16;
    const buttonGap = 30;
    this.startText.setY(buttonsStartY);
    this.escapeText.setY(buttonsStartY + buttonGap);
    this.dieText.setY(buttonsStartY + buttonGap * 2);
    this.farmText.setY(buttonsStartY + buttonGap * 3);
    this.cancelFarmText.setY(buttonsStartY + buttonGap * 4);

    this.farmText.setText(
      `Farm (${this.state.farming.durationSec}s) -> +${this.state.farming.rewardGold} Gold`
    );
    const canFarm = !this.state.run.isRunning && !this.state.farming.isFarming;
    this.farmText.setAlpha(canFarm ? 1 : 0.4);
    this.cancelFarmText.setVisible(this.state.farming.isFarming);
  }
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
