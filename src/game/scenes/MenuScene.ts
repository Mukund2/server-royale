import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // ── Background (deeper, more dramatic) ──
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0826, 0x0f0826, 0x0a1a2e, 0x0a1a2e);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Grid pattern (data center floor)
    const gridGfx = this.add.graphics();
    gridGfx.lineStyle(0.5, 0x1a2a4a, 0.2);
    for (let x = 0; x < GAME_WIDTH; x += 20) {
      gridGfx.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += 20) {
      gridGfx.lineBetween(0, y, GAME_WIDTH, y);
    }

    // Animated particle stars (more, varied)
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.Between(1, 3),
        i % 3 === 0 ? 0xfbbf24 : i % 3 === 1 ? 0x60a5fa : 0xffffff,
        Phaser.Math.FloatBetween(0.1, 0.5),
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.05 },
        duration: Phaser.Math.Between(800, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // ── Floating data center elements ──
    // Server racks (multiple, parallax-feel)
    const racks = [
      { x: 50, y: 300, s: 1.2, a: -8 },
      { x: GAME_WIDTH - 50, y: 310, s: 1.2, a: 8 },
      { x: 35, y: 500, s: 0.8, a: -5 },
      { x: GAME_WIDTH - 35, y: 490, s: 0.8, a: 5 },
    ];
    for (const r of racks) {
      const rack = this.add.image(r.x, r.y, 'server-rack').setScale(r.s).setAlpha(0.12).setAngle(r.a);
      this.tweens.add({
        targets: rack,
        alpha: { from: 0.12, to: 0.22 },
        y: r.y - 5,
        duration: 2500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Data flow lines (animated from top to bottom)
    for (let i = 0; i < 6; i++) {
      const lineX = 40 + i * 70;
      const dot = this.add.circle(lineX, 0, 2, 0x22c55e, 0.4);
      this.tweens.add({
        targets: dot,
        y: GAME_HEIGHT,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000,
      });
    }

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

    // ── Trophy / Info area ──
    const infoBox = this.add.graphics();
    infoBox.fillStyle(0x1a1040, 0.6);
    infoBox.fillRoundedRect(30, 540, GAME_WIDTH - 60, 50, 8);
    infoBox.lineStyle(1.5, 0xfbbf24, 0.3);
    infoBox.strokeRoundedRect(30, 540, GAME_WIDTH - 60, 50, 8);

    // Trophy icon
    const trophyGfx = this.add.graphics();
    trophyGfx.fillStyle(0xfbbf24);
    trophyGfx.fillRoundedRect(56, 552, 16, 12, 3);
    trophyGfx.fillRect(62, 564, 4, 6);
    trophyGfx.fillRect(58, 570, 12, 3);
    trophyGfx.fillStyle(0xfde68a, 0.5);
    trophyGfx.fillRoundedRect(58, 553, 8, 6, 2);

    this.add.text(82, 565, 'AI-Powered Opponent', {
      fontSize: '11px',
      color: '#fbbf24',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.add.text(GAME_WIDTH - 50, 557, 'Mistral', {
      fontSize: '9px',
      color: '#818cf8',
      fontFamily: '"Trebuchet MS", sans-serif',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH - 50, 572, 'AI', {
      fontSize: '12px',
      color: '#818cf8',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // ── How to play (concise) ──
    this.add.text(GAME_WIDTH / 2, 610, 'Deploy workers \u2022 Defend servers \u2022 Survive the AI', {
      fontSize: '10px',
      color: '#475569',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // ── Cards deck preview at bottom ──
    const deckBg = this.add.graphics();
    deckBg.fillStyle(0x1a1040, 0.7);
    deckBg.fillRoundedRect(15, 630, GAME_WIDTH - 30, 85, 10);
    deckBg.lineStyle(1, 0xfbbf24, 0.2);
    deckBg.strokeRoundedRect(15, 630, GAME_WIDTH - 30, 85, 10);

    this.add.text(GAME_WIDTH / 2, 640, 'YOUR DECK', {
      fontSize: '9px',
      color: '#94a3b8',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      letterSpacing: 3,
    }).setOrigin(0.5);

    const cardNames = ['Jr. Tech', 'Sr. Eng', 'AI Bot', 'Firewall'];
    const cardColors = [0x4ade80, 0x3b82f6, 0xf97316, 0x64748b];
    const cardTextures = ['junior-tech', 'senior-engineer', 'ai-bot', 'firewall'];
    for (let i = 0; i < 4; i++) {
      const cx = 62 + i * 82;
      const cy = 676;
      // Mini card background
      const card = this.add.graphics();
      // Shadow
      card.fillStyle(0x000000, 0.4);
      card.fillRoundedRect(cx - 26, cy - 22, 52, 38, 6);
      // Body
      card.fillStyle(0x2d2a4a);
      card.fillRoundedRect(cx - 28, cy - 24, 52, 38, 6);
      card.lineStyle(1.5, 0xfbbf24, 0.5);
      card.strokeRoundedRect(cx - 28, cy - 24, 52, 38, 6);
      // Color bar
      card.fillStyle(cardColors[i], 0.5);
      card.fillRoundedRect(cx - 26, cy - 22, 48, 3, 1);

      // Unit sprite
      if (this.textures.exists(cardTextures[i])) {
        this.add.sprite(cx - 2, cy - 6, cardTextures[i]).setScale(0.7);
      }

      this.add.text(cx - 2, cy + 8, cardNames[i], {
        fontSize: '8px',
        color: '#94a3b8',
        fontFamily: '"Trebuchet MS", sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // ── Footer ──
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 15, 'Mistral AI Worldwide Hackathon 2026', {
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
