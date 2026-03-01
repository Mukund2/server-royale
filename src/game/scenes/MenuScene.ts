import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

    // Title
    this.add.text(GAME_WIDTH / 2, 180, 'SERVER\nROYALE', {
      fontSize: '52px',
      color: '#00ff88',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#003322',
      strokeThickness: 6,
      lineSpacing: 8,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 300, 'Can you keep the servers running?', {
      fontSize: '14px',
      color: '#6688aa',
      fontFamily: 'monospace',
      align: 'center',
    }).setOrigin(0.5);

    // Server rack decoration
    this.add.image(GAME_WIDTH / 2, 420, 'main-server').setScale(2).setAlpha(0.3);

    // Play button
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x22cc66);
    btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);
    btnBg.lineStyle(2, 0x44ff88);
    btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);

    const btnText = this.add.text(GAME_WIDTH / 2, 525, 'DEPLOY', {
      fontSize: '22px',
      color: '#000000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Button interaction
    const btnZone = this.add.zone(GAME_WIDTH / 2, 525, 160, 50).setInteractive();
    btnZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x44ff88);
      btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);
      btnBg.lineStyle(2, 0x66ffaa);
      btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);
    });
    btnZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x22cc66);
      btnBg.fillRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);
      btnBg.lineStyle(2, 0x44ff88);
      btnBg.strokeRoundedRect(GAME_WIDTH / 2 - 80, 500, 160, 50, 12);
    });
    btnZone.on('pointerdown', () => {
      this.scene.start('BattleScene');
    });

    // Instructions
    this.add.text(GAME_WIDTH / 2, 600, 'Select a card, then tap the\ndeploy zone to place workers.\nDefend your servers from AI chaos!', {
      fontSize: '11px',
      color: '#556677',
      fontFamily: 'monospace',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);

    // Credits
    this.add.text(GAME_WIDTH / 2, 720, 'Mistral AI Worldwide Hackathon 2026', {
      fontSize: '9px',
      color: '#333355',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Pulse animation on title
    this.tweens.add({
      targets: this.children.getAt(1),
      alpha: { from: 1, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
