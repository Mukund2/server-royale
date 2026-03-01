import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // ── Background ──
    // Dark gradient feel
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1040, 0x1a1040, 0x0f2027, 0x0f2027);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Animated particle stars
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT / 2),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.6),
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.1 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // ── Server rack decorations ──
    // Left rack
    const rack1 = this.add.image(60, 350, 'server-rack').setScale(1.5).setAlpha(0.15).setAngle(-5);
    // Right rack
    const rack2 = this.add.image(GAME_WIDTH - 60, 350, 'server-rack').setScale(1.5).setAlpha(0.15).setAngle(5);
    this.tweens.add({
      targets: [rack1, rack2],
      alpha: { from: 0.15, to: 0.25 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Title banner ──
    // Banner background (Clash Royale style ribbon)
    const banner = this.add.graphics();
    // Shadow
    banner.fillStyle(0x000000, 0.4);
    banner.fillRect(20, 128, GAME_WIDTH - 40, 100);
    // Main banner
    banner.fillStyle(0x7c2d12);
    banner.fillRect(15, 120, GAME_WIDTH - 30, 100);
    // Banner highlight
    banner.fillStyle(0x9a3412);
    banner.fillRect(15, 120, GAME_WIDTH - 30, 50);
    // Gold border
    banner.lineStyle(3, 0xfbbf24);
    banner.strokeRect(15, 120, GAME_WIDTH - 30, 100);
    // Inner gold line
    banner.lineStyle(1, 0xfbbf24, 0.4);
    banner.strokeRect(20, 125, GAME_WIDTH - 40, 90);

    // Banner ribbon ends (triangles)
    banner.fillStyle(0x5c1d0e);
    banner.fillTriangle(0, 120, 15, 120, 15, 145);
    banner.fillTriangle(GAME_WIDTH, 120, GAME_WIDTH - 15, 120, GAME_WIDTH - 15, 145);
    banner.fillTriangle(0, 220, 15, 220, 15, 195);
    banner.fillTriangle(GAME_WIDTH, 220, GAME_WIDTH - 15, 220, GAME_WIDTH - 15, 195);

    // Title text
    const titleShadow = this.add.text(GAME_WIDTH / 2 + 2, 152, 'SERVER', {
      fontSize: '48px',
      color: '#000000',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const title1 = this.add.text(GAME_WIDTH / 2, 150, 'SERVER', {
      fontSize: '48px',
      color: '#fbbf24',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#7c2d12',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const title2Shadow = this.add.text(GAME_WIDTH / 2 + 2, 197, 'ROYALE', {
      fontSize: '38px',
      color: '#000000',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const title2 = this.add.text(GAME_WIDTH / 2, 195, 'ROYALE', {
      fontSize: '38px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#7c2d12',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Title pulse
    this.tweens.add({
      targets: [title1, title2],
      scaleX: { from: 1, to: 1.03 },
      scaleY: { from: 1, to: 1.03 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Subtitle ──
    this.add.text(GAME_WIDTH / 2, 260, 'Can you keep the servers running?', {
      fontSize: '13px',
      color: '#94a3b8',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // ── Main server display ──
    const mainServer = this.add.image(GAME_WIDTH / 2, 370, 'main-server').setScale(2.5);
    // Glow behind it
    const glow = this.add.circle(GAME_WIDTH / 2, 370, 60, 0xfbbf24, 0.08);
    this.tweens.add({
      targets: glow,
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      alpha: { from: 0.08, to: 0.02 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // ── Battle / Deploy Button (Clash Royale orange) ──
    const btnW = 200, btnH = 56;
    const btnX = GAME_WIDTH / 2 - btnW / 2;
    const btnY = 475;

    const btn = this.add.graphics();
    this.drawButton(btn, btnX, btnY, btnW, btnH, false);

    const btnText = this.add.text(GAME_WIDTH / 2, btnY + btnH / 2, 'BATTLE!', {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const btnZone = this.add.zone(GAME_WIDTH / 2, btnY + btnH / 2, btnW, btnH).setInteractive();
    btnZone.on('pointerover', () => {
      this.drawButton(btn, btnX, btnY, btnW, btnH, true);
      btnText.setScale(1.05);
    });
    btnZone.on('pointerout', () => {
      this.drawButton(btn, btnX, btnY, btnW, btnH, false);
      btnText.setScale(1);
    });
    btnZone.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('BattleScene'));
    });

    // Button bounce animation
    this.tweens.add({
      targets: [btnText],
      y: btnY + btnH / 2 - 2,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── How to play ──
    const instructions = this.add.text(GAME_WIDTH / 2, 570, [
      'Select cards from your hand',
      'Tap the field to deploy workers',
      'Defend your servers from AI chaos!',
    ].join('\n'), {
      fontSize: '12px',
      color: '#64748b',
      fontFamily: '"Trebuchet MS", sans-serif',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    // ── Cards preview at bottom ──
    const cardNames = ['Jr. Tech', 'Sr. Eng', 'AI Bot', 'Firewall'];
    const cardColors = [0x4ade80, 0x3b82f6, 0xf97316, 0x64748b];
    for (let i = 0; i < 4; i++) {
      const cx = 70 + i * 80;
      const cy = 660;
      // Mini card
      const card = this.add.graphics();
      card.fillStyle(0x2d2a4a);
      card.fillRoundedRect(cx - 28, cy - 35, 56, 70, 8);
      card.lineStyle(1.5, 0xfbbf24, 0.5);
      card.strokeRoundedRect(cx - 28, cy - 35, 56, 70, 8);
      // Color pip
      card.fillStyle(cardColors[i]);
      card.fillCircle(cx, cy - 8, 10);
      card.lineStyle(1.5, 0x000000, 0.5);
      card.strokeCircle(cx, cy - 8, 10);

      this.add.text(cx, cy + 18, cardNames[i], {
        fontSize: '9px',
        color: '#94a3b8',
        fontFamily: '"Trebuchet MS", sans-serif',
      }).setOrigin(0.5);
    }

    // ── Footer ──
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, 'Mistral AI Worldwide Hackathon 2026', {
      fontSize: '9px',
      color: '#334155',
      fontFamily: '"Trebuchet MS", sans-serif',
    }).setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  private drawButton(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, hover: boolean) {
    g.clear();
    // Shadow
    g.fillStyle(0x000000, 0.5);
    g.fillRoundedRect(x + 3, y + 4, w, h, 12);
    // Bottom (darker)
    g.fillStyle(hover ? 0xb45309 : 0x9a3412);
    g.fillRoundedRect(x, y + 4, w, h - 4, 12);
    // Top (brighter)
    g.fillStyle(hover ? 0xfb923c : 0xf97316);
    g.fillRoundedRect(x, y, w, h - 6, 12);
    // Highlight
    g.fillStyle(0xffffff, 0.15);
    g.fillRoundedRect(x + 6, y + 3, w - 12, h / 3, 8);
    // Border
    g.lineStyle(2, 0xfbbf24, 0.8);
    g.strokeRoundedRect(x, y, w, h - 2, 12);
  }
}
