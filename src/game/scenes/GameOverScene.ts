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
    // ── Background (dramatic) ──
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0a1e, 0x0f0a1e, 0x1a0a0a, 0x1a0a0a);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Radial spotlight from top
    const spotlight = this.add.graphics();
    spotlight.fillStyle(0xfbbf24, 0.03);
    spotlight.fillTriangle(GAME_WIDTH / 2, 0, -50, GAME_HEIGHT / 2, GAME_WIDTH + 50, GAME_HEIGHT / 2);

    // Particle dust (more, varied colors)
    const isGood = data.wave >= 5;
    const isGreat = data.wave >= 10;
    const isLegendary = data.wave >= 15;
    const particleColor = isLegendary ? 0xfbbf24 : isGreat ? 0x22c55e : isGood ? 0x3b82f6 : 0xef4444;

    for (let i = 0; i < 35; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.Between(1, 3),
        i % 3 === 0 ? particleColor : 0xffffff,
        Phaser.Math.FloatBetween(0.1, 0.4),
      );
      this.tweens.add({
        targets: p,
        y: p.y - 40,
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        repeat: -1,
      });
    }

    // ── Crown Collection (animated, Clash Royale style) ──
    const crowns = Math.min(3, Math.floor(data.wave / 3));
    const crownY = 40;
    for (let i = 0; i < 3; i++) {
      const cx = GAME_WIDTH / 2 + (i - 1) * 55;
      const earned = i < crowns;

      const crownGfx = this.add.graphics().setDepth(5);
      if (earned) {
        // Glow
        crownGfx.fillStyle(0xfbbf24, 0.15);
        crownGfx.fillCircle(cx, crownY, 22);
        // Crown body
        crownGfx.fillStyle(0xfbbf24);
        crownGfx.fillRect(cx - 12, crownY - 2, 24, 14);
        crownGfx.fillTriangle(cx - 12, crownY - 2, cx - 6, crownY - 12, cx, crownY - 2);
        crownGfx.fillTriangle(cx, crownY - 2, cx, crownY - 14, cx, crownY - 2);
        crownGfx.fillTriangle(cx, crownY - 2, cx + 6, crownY - 12, cx + 12, crownY - 2);
        // Gems
        crownGfx.fillStyle(0xef4444);
        crownGfx.fillCircle(cx - 6, crownY + 4, 2.5);
        crownGfx.fillStyle(0x3b82f6);
        crownGfx.fillCircle(cx, crownY + 4, 2.5);
        crownGfx.fillStyle(0x22c55e);
        crownGfx.fillCircle(cx + 6, crownY + 4, 2.5);
        crownGfx.lineStyle(2, 0x92400e);
        crownGfx.strokeRect(cx - 12, crownY - 2, 24, 14);
      } else {
        // Empty crown slot
        crownGfx.fillStyle(0x333333, 0.5);
        crownGfx.fillRect(cx - 12, crownY - 2, 24, 14);
        crownGfx.fillTriangle(cx - 12, crownY - 2, cx - 6, crownY - 10, cx, crownY - 2);
        crownGfx.fillTriangle(cx, crownY - 2, cx + 6, crownY - 10, cx + 12, crownY - 2);
        crownGfx.lineStyle(1, 0x555555, 0.5);
        crownGfx.strokeRect(cx - 12, crownY - 2, 24, 14);
      }

      // Animated slam for earned crowns
      if (earned) {
        crownGfx.setScale(0);
        this.tweens.add({
          targets: crownGfx,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 300,
          delay: 400 + i * 300,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.cameras.main.shake(80, 0.003);
            this.tweens.add({
              targets: crownGfx,
              scaleX: 1,
              scaleY: 1,
              duration: 150,
            });
          },
        });
      }
    }

    // ── Result banner (Clash Royale style) ──
    const bannerColor = isLegendary ? 0xfbbf24 : isGreat ? 0x22c55e : isGood ? 0x3b82f6 : 0xef4444;
    const bannerDark = isLegendary ? 0x92400e : isGreat ? 0x166534 : isGood ? 0x1e3a8a : 0x7f1d1d;

    const banner = this.add.graphics();
    // Shadow
    banner.fillStyle(0x000000, 0.5);
    banner.fillRoundedRect(22, 77, GAME_WIDTH - 40, 85, 12);
    // Banner body
    banner.fillStyle(bannerDark);
    banner.fillRoundedRect(18, 70, GAME_WIDTH - 36, 85, 12);
    // Top half lighter
    banner.fillStyle(bannerDark + 0x111111);
    banner.fillRoundedRect(18, 70, GAME_WIDTH - 36, 42, { tl: 12, tr: 12, bl: 0, br: 0 });
    // Gold trim
    banner.lineStyle(3, bannerColor, 0.9);
    banner.strokeRoundedRect(18, 70, GAME_WIDTH - 36, 85, 12);
    // Inner trim
    banner.lineStyle(1, bannerColor, 0.3);
    banner.strokeRoundedRect(22, 74, GAME_WIDTH - 44, 77, 10);

    // Ribbon ends
    banner.fillStyle(bannerDark - 0x111111);
    banner.fillTriangle(0, 70, 18, 70, 18, 95);
    banner.fillTriangle(GAME_WIDTH, 70, GAME_WIDTH - 18, 70, GAME_WIDTH - 18, 95);
    banner.fillTriangle(0, 155, 18, 155, 18, 130);
    banner.fillTriangle(GAME_WIDTH, 155, GAME_WIDTH - 18, 155, GAME_WIDTH - 18, 130);

    // Title
    const title = isLegendary ? 'LEGENDARY!' :
                  isGreat ? 'IMPRESSIVE!' :
                  isGood ? 'GOOD RUN!' :
                  'SERVER DOWN';

    // Title shadow
    this.add.text(GAME_WIDTH / 2 + 2, 97, title, {
      fontSize: '34px',
      color: '#000000',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const titleText = this.add.text(GAME_WIDTH / 2, 95, title, {
      fontSize: '34px',
      color: `#${bannerColor.toString(16).padStart(6, '0')}`,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Title slam animation
    titleText.setScale(0.5);
    this.tweens.add({
      targets: titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({ targets: titleText, scaleX: 1, scaleY: 1, duration: 150 });
      },
    });

    this.add.text(GAME_WIDTH / 2, 135, `Survived ${data.wave} wave${data.wave !== 1 ? 's' : ''}`, {
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

    // ── Stats (animated counting, Clash Royale style) ──
    const statsBox = this.add.graphics();
    statsBox.fillStyle(0x1a1040, 0.6);
    statsBox.fillRoundedRect(25, 240, GAME_WIDTH - 50, 180, 10);
    statsBox.lineStyle(1.5, 0xfbbf24, 0.2);
    statsBox.strokeRoundedRect(25, 240, GAME_WIDTH - 50, 180, 10);

    const stats = [
      { label: 'Waves Survived', numValue: data.wave, suffix: '', color: '#60a5fa' },
      { label: 'Server Uptime', numValue: data.uptime, suffix: '%', color: '#4ade80' },
      { label: 'Workers Deployed', numValue: data.unitsDeployed, suffix: '', color: '#818cf8' },
      { label: 'Threats Defeated', numValue: data.enemiesDefeated, suffix: '', color: '#f97316' },
      { label: 'Survival Time', numValue: data.elapsed, suffix: 's', color: '#94a3b8' },
    ];

    let sy = 248;
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      // Row bg alternating
      if (i % 2 === 0) {
        const rowBg = this.add.graphics();
        rowBg.fillStyle(0xffffff, 0.03);
        rowBg.fillRoundedRect(30, sy, GAME_WIDTH - 60, 32, 4);
      }

      this.add.text(50, sy + 16, stat.label, {
        fontSize: '12px',
        color: '#64748b',
        fontFamily: '"Trebuchet MS", sans-serif',
      }).setOrigin(0, 0.5);

      // Animated counting number
      const valueText = this.add.text(GAME_WIDTH - 50, sy + 16, '0' + stat.suffix, {
        fontSize: '18px',
        color: stat.color,
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(1, 0.5);

      // Count-up animation
      const countObj = { val: 0 };
      this.tweens.add({
        targets: countObj,
        val: stat.numValue,
        duration: 800,
        delay: 500 + i * 150,
        ease: 'Power2',
        onUpdate: () => {
          valueText.setText(`${Math.round(countObj.val)}${stat.suffix}`);
        },
      });

      sy += 34;
    }

    // ── Flavor text (varies by performance) ──
    const flavors = isLegendary
      ? 'The data center stands tall.\nYou are the SRE legend.'
      : isGreat
      ? 'Servers humming, threats neutralized.\nImpressive sysadmin skills.'
      : isGood
      ? 'The data center workforce crisis\ncontinues... but you held the line.'
      : 'Servers down. Pagers screaming.\nBetter luck next deploy.';

    this.add.text(GAME_WIDTH / 2, 430, flavors, {
      fontSize: '11px',
      color: '#475569',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'italic',
      align: 'center',
      lineSpacing: 5,
    }).setOrigin(0.5);

    // Victory confetti (for good results)
    if (isGood) {
      for (let i = 0; i < 20; i++) {
        const confettiColors = [0xfbbf24, 0x22c55e, 0x60a5fa, 0xf472b6, 0xffffff];
        const color = confettiColors[i % confettiColors.length];
        const cx = Phaser.Math.Between(20, GAME_WIDTH - 20);
        const confetti = this.add.rectangle(cx, -10, 5, 3, color, 0.8);
        confetti.setAngle(Phaser.Math.Between(0, 360));
        this.tweens.add({
          targets: confetti,
          y: GAME_HEIGHT + 20,
          angle: confetti.angle + Phaser.Math.Between(-360, 360),
          x: cx + Phaser.Math.Between(-40, 40),
          duration: 2000 + Math.random() * 2000,
          delay: i * 100,
          ease: 'Sine.easeIn',
          onComplete: () => confetti.destroy(),
        });
      }
    }

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
