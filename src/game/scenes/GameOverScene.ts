import * as Phaser from 'phaser';
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
    // ── Background ──
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0a1e, 0x0f0a1e, 0x1a0a0a, 0x1a0a0a);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Particle dust
    for (let i = 0; i < 20; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.Between(1, 2),
        data.wave >= 10 ? 0xfbbf24 : 0xff4444,
        Phaser.Math.FloatBetween(0.1, 0.3),
      );
      this.tweens.add({
        targets: p,
        y: p.y - 30,
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        repeat: -1,
      });
    }

    // ── Result banner ──
    const isGood = data.wave >= 5;
    const isGreat = data.wave >= 10;
    const isLegendary = data.wave >= 15;

    const bannerColor = isLegendary ? 0xfbbf24 : isGreat ? 0x22c55e : isGood ? 0x3b82f6 : 0xef4444;
    const bannerDark = isLegendary ? 0x92400e : isGreat ? 0x166534 : isGood ? 0x1e3a8a : 0x7f1d1d;

    const banner = this.add.graphics();
    // Shadow
    banner.fillStyle(0x000000, 0.5);
    banner.fillRoundedRect(22, 72, GAME_WIDTH - 40, 80, 10);
    // Banner body
    banner.fillStyle(bannerDark);
    banner.fillRoundedRect(18, 65, GAME_WIDTH - 36, 80, 10);
    banner.fillStyle(bannerDark + 0x111111);
    banner.fillRoundedRect(18, 65, GAME_WIDTH - 36, 40, { tl: 10, tr: 10, bl: 0, br: 0 });
    // Gold trim
    banner.lineStyle(2.5, bannerColor, 0.8);
    banner.strokeRoundedRect(18, 65, GAME_WIDTH - 36, 80, 10);

    // Title
    const title = isLegendary ? 'LEGENDARY!' :
                  isGreat ? 'IMPRESSIVE!' :
                  isGood ? 'GOOD RUN!' :
                  'SERVER DOWN';

    this.add.text(GAME_WIDTH / 2, 88, title, {
      fontSize: '32px',
      color: `#${bannerColor.toString(16).padStart(6, '0')}`,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 128, `Survived ${data.wave} wave${data.wave !== 1 ? 's' : ''}`, {
      fontSize: '14px',
      color: '#94a3b8',
      fontFamily: '"Trebuchet MS", sans-serif',
    }).setOrigin(0.5);

    // ── Score ──
    const score = data.wave * 100 + data.uptime * 5 + data.unitsDeployed * 10 + data.enemiesDefeated * 15;

    // Score box
    const scoreBox = this.add.graphics();
    scoreBox.fillStyle(0x1a1040, 0.8);
    scoreBox.fillRoundedRect(GAME_WIDTH / 2 - 80, 165, 160, 50, 10);
    scoreBox.lineStyle(2, 0xfbbf24, 0.6);
    scoreBox.strokeRoundedRect(GAME_WIDTH / 2 - 80, 165, 160, 50, 10);

    this.add.text(GAME_WIDTH / 2, 178, 'SCORE', {
      fontSize: '10px',
      color: '#94a3b8',
      fontFamily: '"Trebuchet MS", sans-serif',
    }).setOrigin(0.5);

    const scoreText = this.add.text(GAME_WIDTH / 2, 200, `${score}`, {
      fontSize: '28px',
      color: '#fbbf24',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Score pop animation
    scoreText.setScale(0);
    this.tweens.add({
      targets: scoreText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 400,
      delay: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: scoreText,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
        });
      },
    });

    // ── Stats ──
    const stats = [
      { icon: '\u{1F30A}', label: 'Waves', value: `${data.wave}`, color: '#60a5fa' },
      { icon: '\u{2B06}', label: 'Uptime', value: `${data.uptime}%`, color: '#4ade80' },
      { icon: '\u{1F464}', label: 'Workers', value: `${data.unitsDeployed}`, color: '#818cf8' },
      { icon: '\u{1F4A5}', label: 'Defeated', value: `${data.enemiesDefeated}`, color: '#f97316' },
      { icon: '\u{23F1}', label: 'Time', value: `${data.elapsed}s`, color: '#94a3b8' },
    ];

    let sy = 240;
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      // Row bg alternating
      if (i % 2 === 0) {
        const rowBg = this.add.graphics();
        rowBg.fillStyle(0xffffff, 0.03);
        rowBg.fillRect(30, sy - 2, GAME_WIDTH - 60, 28);
      }

      this.add.text(50, sy + 10, stat.label, {
        fontSize: '13px',
        color: '#64748b',
        fontFamily: '"Trebuchet MS", sans-serif',
      }).setOrigin(0, 0.5);

      this.add.text(GAME_WIDTH - 50, sy + 10, stat.value, {
        fontSize: '16px',
        color: stat.color,
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(1, 0.5);

      sy += 32;
    }

    // ── Flavor text ──
    this.add.text(GAME_WIDTH / 2, 430, 'The data center workforce crisis\ncontinues... but you held the line.', {
      fontSize: '11px',
      color: '#475569',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'italic',
      align: 'center',
      lineSpacing: 5,
    }).setOrigin(0.5);

    // ── Buttons ──
    // Replay button (orange, like Clash Royale)
    this.createButton(GAME_WIDTH / 2, 500, 180, 52, 'BATTLE AGAIN', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('BattleScene'));
    }, 0xf97316, 0x9a3412);

    // Menu button (subtle)
    const menuText = this.add.text(GAME_WIDTH / 2, 560, 'MAIN MENU', {
      fontSize: '13px',
      color: '#64748b',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive();

    menuText.on('pointerover', () => menuText.setColor('#94a3b8'));
    menuText.on('pointerout', () => menuText.setColor('#64748b'));
    menuText.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('MenuScene'));
    });

    // ── Hackathon credit ──
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, 'Built for Mistral AI Hackathon 2026', {
      fontSize: '9px',
      color: '#334155',
      fontFamily: '"Trebuchet MS", sans-serif',
    }).setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  private createButton(
    x: number, y: number, w: number, h: number,
    label: string, onClick: () => void,
    color: number = 0xf97316, darkColor: number = 0x9a3412,
  ) {
    const btn = this.add.graphics();
    const bx = x - w / 2;
    const by = y - h / 2;

    const draw = (hover: boolean) => {
      btn.clear();
      btn.fillStyle(0x000000, 0.5);
      btn.fillRoundedRect(bx + 3, by + 4, w, h, 12);
      btn.fillStyle(hover ? darkColor + 0x111111 : darkColor);
      btn.fillRoundedRect(bx, by + 4, w, h - 4, 12);
      btn.fillStyle(hover ? color + 0x111111 : color);
      btn.fillRoundedRect(bx, by, w, h - 6, 12);
      btn.fillStyle(0xffffff, 0.15);
      btn.fillRoundedRect(bx + 6, by + 3, w - 12, h / 3, 8);
      btn.lineStyle(2, 0xfbbf24, 0.7);
      btn.strokeRoundedRect(bx, by, w, h - 2, 12);
    };

    draw(false);

    const text = this.add.text(x, y - 1, label, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive();
    zone.on('pointerover', () => { draw(true); text.setScale(1.05); });
    zone.on('pointerout', () => { draw(false); text.setScale(1); });
    zone.on('pointerdown', onClick);
  }
}
