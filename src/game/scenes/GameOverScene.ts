import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

interface GameOverData {
  wave: number;
  uptime: number;
  unitsDeployed: number;
  enemiesDefeated: number;
  elapsed: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData) {
    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

    // Title
    const title = data.wave >= 15 ? 'LEGENDARY UPTIME!' :
                  data.wave >= 10 ? 'IMPRESSIVE RUN!' :
                  data.wave >= 5 ? 'GOOD EFFORT!' :
                  'SERVER DOWN';
    const titleColor = data.wave >= 10 ? '#ffdd22' : data.wave >= 5 ? '#22cc66' : '#ff4444';

    this.add.text(GAME_WIDTH / 2, 140, title, {
      fontSize: '32px',
      color: titleColor,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 190, `Survived ${data.wave} waves`, {
      fontSize: '18px',
      color: '#aaaacc',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Score calculation
    const score = data.wave * 100 + data.uptime * 5 + data.unitsDeployed * 10 + data.enemiesDefeated * 15;

    // Stats box
    const stats = [
      { label: 'SCORE', value: `${score}`, color: '#ffdd22' },
      { label: 'Waves Survived', value: `${data.wave}`, color: '#ffffff' },
      { label: 'Uptime', value: `${data.uptime}%`, color: '#22cc66' },
      { label: 'Workers Deployed', value: `${data.unitsDeployed}`, color: '#3388ff' },
      { label: 'Threats Neutralized', value: `${data.enemiesDefeated}`, color: '#ff8833' },
      { label: 'Time', value: `${data.elapsed}s`, color: '#aaaacc' },
    ];

    let y = 260;
    for (const stat of stats) {
      this.add.text(100, y, stat.label, {
        fontSize: stat.label === 'SCORE' ? '16px' : '13px',
        color: '#777799',
        fontFamily: 'monospace',
      });
      this.add.text(GAME_WIDTH - 100, y, stat.value, {
        fontSize: stat.label === 'SCORE' ? '20px' : '14px',
        color: stat.color,
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }).setOrigin(1, 0);
      y += stat.label === 'SCORE' ? 45 : 30;
    }

    // Narrative
    this.add.text(GAME_WIDTH / 2, 520, 'The data center workforce crisis\ncontinues... but you held the line.', {
      fontSize: '11px',
      color: '#556677',
      fontFamily: 'monospace',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);

    // Replay button
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x22cc66);
    btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);
    btnBg.lineStyle(2, 0x44ff88);
    btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);

    this.add.text(GAME_WIDTH / 2, 605, 'REDEPLOY', {
      fontSize: '20px',
      color: '#000000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const btnZone = this.add.zone(GAME_WIDTH / 2, 605, 160, 50).setInteractive();
    btnZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x44ff88);
      btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);
      btnBg.lineStyle(2, 0x66ffaa);
      btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);
    });
    btnZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x22cc66);
      btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);
      btnBg.lineStyle(2, 0x44ff88);
      btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 580, 160, 50, 12);
    });
    btnZone.on('pointerdown', () => {
      this.scene.start('BattleScene');
    });

    // Menu button
    this.add.text(GAME_WIDTH / 2, 660, 'MAIN MENU', {
      fontSize: '12px',
      color: '#556677',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Animate score
    const scoreText = this.children.getAt(4) as Phaser.GameObjects.Text;
    if (scoreText) {
      this.tweens.add({
        targets: scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 300,
        yoyo: true,
        ease: 'Power2',
      });
    }
  }
}
