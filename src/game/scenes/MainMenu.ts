import { Scene, GameObjects } from 'phaser';
import { loadGameState } from '@/core/storage';

export class MainMenu extends Scene
{
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  statusText: GameObjects.Text;

  constructor ()
  {
    super('MainMenu');
  }

  create ()
  {
    this.background = this.add.image(512, 384, 'background');

    this.logo = this.add.image(512, 300, 'logo');

    this.title = this.add.text(512, 460, 'Main Menu', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    const state = loadGameState();
    this.statusText = this.add.text(512, 540, [
      `Gold: ${state.gold}`,
      `Permanent XP: ${state.meta.permanentXP}`,
      `Last Run Time: ${formatTime(state.run.timeSec)}`,
      `Last Safe XP: ${state.run.safeXP}`,
      `Last Risk XP: ${state.run.riskXP}`
    ], {
      fontFamily: 'Arial', fontSize: 18, color: '#ffffff',
      stroke: '#000000', strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {

      this.scene.start('MainScene');

    });
  }
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
