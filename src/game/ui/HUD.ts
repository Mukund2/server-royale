import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, WAVE_INTERVAL } from '../config/constants';
import { BudgetSystem } from '../systems/BudgetSystem';
import { WaveSystem } from '../systems/WaveSystem';

export class HUD {
  private scene: Phaser.Scene;
  private budgetBar: Phaser.GameObjects.Graphics;
  private budgetText: Phaser.GameObjects.Text;
  private waveText: Phaser.GameObjects.Text;
  private waveBg: Phaser.GameObjects.Graphics;
  private unitHpGraphics: Phaser.GameObjects.Graphics;
  private elixirDrops: Phaser.GameObjects.Graphics;
  private elixirLabel: Phaser.GameObjects.Text;
  private waveTimerText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Wave counter banner (top center, Clash Royale style)
    this.waveBg = scene.add.graphics().setDepth(50);
    this.waveText = scene.add.text(GAME_WIDTH / 2, 19, 'WAVE 0', {
      fontSize: '18px',
      color: '#fbbf24',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5).setDepth(51);

    // Budget/Elixir bar
    this.budgetBar = scene.add.graphics().setDepth(55);
    this.elixirDrops = scene.add.graphics().setDepth(55);

    // "ELIXIR" label above the bar
    this.elixirLabel = scene.add.text(12, GAME_HEIGHT - 100, 'ELIXIR', {
      fontSize: '8px',
      color: '#c026d3',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      letterSpacing: 2,
    }).setDepth(55).setAlpha(0.6);

    // Budget text (centered on elixir drop)
    this.budgetText = scene.add.text(GAME_WIDTH - 30, GAME_HEIGHT - 84, '5', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5).setDepth(56);

    // Wave timer countdown (small, below wave banner)
    this.waveTimerText = scene.add.text(GAME_WIDTH / 2, 40, '', {
      fontSize: '10px',
      color: '#94a3b8',
      fontFamily: '"Trebuchet MS", sans-serif',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(51).setAlpha(0.7);

    // HP bar renderer for units
    this.unitHpGraphics = scene.add.graphics().setDepth(45);
  }

  update(budget: BudgetSystem, wave: WaveSystem) {
    this.drawWaveBanner(wave.wave);
    this.drawBudgetBar(budget);

    // Wave countdown timer
    const remaining = Math.max(0, WAVE_INTERVAL - wave.waveTimer);
    const secs = Math.ceil(remaining / 1000);
    if (secs > 0 && secs <= 15) {
      this.waveTimerText.setText(`Next wave: ${secs}s`);
      this.waveTimerText.setAlpha(secs <= 5 ? 1 : 0.6);
      this.waveTimerText.setColor(secs <= 5 ? '#ef4444' : '#94a3b8');
    } else {
      this.waveTimerText.setText('');
    }
  }

  private drawWaveBanner(waveNum: number) {
    this.waveBg.clear();

    const bw = 120, bh = 30;
    const bx = GAME_WIDTH / 2 - bw / 2;
    const by = 4;

    // Shadow
    this.waveBg.fillStyle(0x000000, 0.5);
    this.waveBg.fillRoundedRect(bx + 2, by + 3, bw, bh, 8);
    // Banner body
    this.waveBg.fillStyle(0x7c2d12);
    this.waveBg.fillRoundedRect(bx, by, bw, bh, 8);
    // Top highlight
    this.waveBg.fillStyle(0x9a3412);
    this.waveBg.fillRoundedRect(bx, by, bw, bh / 2, { tl: 8, tr: 8, bl: 0, br: 0 });
    // Inner glow
    this.waveBg.fillStyle(0xfbbf24, 0.08);
    this.waveBg.fillRoundedRect(bx + 3, by + 3, bw - 6, bh - 6, 6);
    // Gold border
    this.waveBg.lineStyle(2, 0xfbbf24, 0.9);
    this.waveBg.strokeRoundedRect(bx, by, bw, bh, 8);
    // Inner gold line
    this.waveBg.lineStyle(0.5, 0xfbbf24, 0.3);
    this.waveBg.strokeRoundedRect(bx + 2, by + 2, bw - 4, bh - 4, 6);
    // Ribbon ends
    this.waveBg.fillStyle(0x5c1d0e);
    this.waveBg.fillTriangle(bx - 6, by, bx, by, bx, by + 10);
    this.waveBg.fillTriangle(bx + bw + 6, by, bx + bw, by, bx + bw, by + 10);
    this.waveBg.fillTriangle(bx - 6, by + bh, bx, by + bh, bx, by + bh - 10);
    this.waveBg.fillTriangle(bx + bw + 6, by + bh, bx + bw, by + bh, bx + bw, by + bh - 10);

    this.waveText.setText(`WAVE ${waveNum}`);
    this.waveText.setPosition(GAME_WIDTH / 2, by + bh / 2);
  }

  private drawBudgetBar(budget: BudgetSystem) {
    this.budgetBar.clear();
    this.elixirDrops.clear();

    const barX = 12;
    const barY = GAME_HEIGHT - 94;
    const barW = GAME_WIDTH - 60;
    const barH = 20;
    const segW = barW / budget.maxBudget;

    // Bar shadow (deeper)
    this.budgetBar.fillStyle(0x000000, 0.6);
    this.budgetBar.fillRoundedRect(barX + 2, barY + 3, barW, barH, 7);

    // Bar background (dark)
    this.budgetBar.fillStyle(0x120a2e);
    this.budgetBar.fillRoundedRect(barX, barY, barW, barH, 7);

    // Inner background depression
    this.budgetBar.fillStyle(0x0a0518);
    this.budgetBar.fillRoundedRect(barX + 2, barY + 2, barW - 4, barH - 4, 5);

    // Fill each segment individually (Clash Royale style — each pip lights up)
    const fullPips = Math.floor(budget.budget);
    const partialFill = budget.budget - fullPips;

    for (let i = 0; i < budget.maxBudget; i++) {
      const sx = barX + 2 + i * segW;
      const sw = segW - 2;

      if (i < fullPips) {
        // Fully filled pip — bright pink/purple
        this.budgetBar.fillStyle(0xc026d3);
        this.budgetBar.fillRoundedRect(sx + 1, barY + 3, sw, barH - 6, 3);
        // Lighter top half (glass effect)
        this.budgetBar.fillStyle(0xd946ef, 0.5);
        this.budgetBar.fillRoundedRect(sx + 2, barY + 3, sw - 2, (barH - 6) / 2, { tl: 2, tr: 2, bl: 0, br: 0 });
        // Bright highlight line
        this.budgetBar.fillStyle(0xf0abfc, 0.3);
        this.budgetBar.fillRoundedRect(sx + 3, barY + 4, sw / 2, 3, 1);
      } else if (i === fullPips && partialFill > 0.05) {
        // Partially filled pip
        const fillPx = sw * partialFill;
        this.budgetBar.fillStyle(0xc026d3, 0.7);
        this.budgetBar.fillRoundedRect(sx + 1, barY + 3, fillPx, barH - 6, 3);
        this.budgetBar.fillStyle(0xd946ef, 0.3);
        this.budgetBar.fillRoundedRect(sx + 2, barY + 3, fillPx - 1, (barH - 6) / 2, { tl: 2, tr: 2, bl: 0, br: 0 });
      }
    }

    // Segment divider lines (thin, subtle)
    for (let i = 1; i < budget.maxBudget; i++) {
      const sx = barX + 2 + i * segW;
      this.budgetBar.lineStyle(1.5, 0x1a0a2e, 0.8);
      this.budgetBar.lineBetween(sx, barY + 3, sx, barY + barH - 3);
    }

    // Full bar glow when maxed
    if (budget.budget >= budget.maxBudget - 0.1) {
      this.budgetBar.lineStyle(2, 0xf0abfc, 0.3);
      this.budgetBar.strokeRoundedRect(barX - 1, barY - 1, barW + 2, barH + 2, 8);
    }

    // Main border (purple)
    this.budgetBar.lineStyle(2.5, 0x7c3aed, 0.9);
    this.budgetBar.strokeRoundedRect(barX, barY, barW, barH, 7);

    // Gold outer accent
    this.budgetBar.lineStyle(1, 0xfbbf24, 0.25);
    this.budgetBar.strokeRoundedRect(barX - 1, barY - 1, barW + 2, barH + 2, 8);

    // Elixir drop icon (right side — bigger, more detailed)
    const dropX = GAME_WIDTH - 30;
    const dropY = barY + barH / 2;
    // Drop shadow
    this.elixirDrops.fillStyle(0x000000, 0.4);
    this.elixirDrops.fillCircle(dropX + 1, dropY + 1, 11);
    // Drop body (pink-purple)
    this.elixirDrops.fillStyle(0xc026d3);
    this.elixirDrops.fillCircle(dropX, dropY, 10);
    // Drop top (teardrop shape)
    this.elixirDrops.fillStyle(0xc026d3);
    this.elixirDrops.fillTriangle(dropX, dropY - 14, dropX - 6, dropY - 4, dropX + 6, dropY - 4);
    // Drop highlight
    this.elixirDrops.fillStyle(0xd946ef, 0.6);
    this.elixirDrops.fillCircle(dropX - 3, dropY - 3, 4);
    // Drop shine
    this.elixirDrops.fillStyle(0xffffff, 0.4);
    this.elixirDrops.fillCircle(dropX - 3, dropY - 5, 2);
    // Gold border
    this.elixirDrops.lineStyle(2, 0xfbbf24, 0.7);
    this.elixirDrops.strokeCircle(dropX, dropY, 10);

    // Budget number
    this.budgetText.setText(`${Math.floor(budget.budget)}`);
    this.budgetText.setPosition(dropX, dropY + 1);
  }

  drawUnitHpBars(units: Phaser.Physics.Arcade.Group) {
    this.unitHpGraphics.clear();

    const children = units.getChildren() as Phaser.Physics.Arcade.Sprite[];
    for (const sprite of children) {
      const unit = sprite as any;
      if (!unit.active || !unit.hp || !unit.maxHp) continue;

      const isPlayer = unit.side === 'player';
      const barW = 26;
      const barH = 5;
      const barX = unit.x - barW / 2;
      const barY = unit.y - unit.displayHeight / 2 - 9;

      // Shadow
      this.unitHpGraphics.fillStyle(0x000000, 0.5);
      this.unitHpGraphics.fillRoundedRect(barX + 1, barY + 1, barW, barH, 2);

      // BG
      this.unitHpGraphics.fillStyle(0x1a1a2e);
      this.unitHpGraphics.fillRoundedRect(barX, barY, barW, barH, 2);

      // Fill — team colored (blue for player, red for enemy in Clash Royale)
      const hpRatio = unit.hp / unit.maxHp;
      let color: number;
      if (isPlayer) {
        color = hpRatio > 0.6 ? 0x22c55e : hpRatio > 0.3 ? 0xfbbf24 : 0xef4444;
      } else {
        color = hpRatio > 0.6 ? 0xef4444 : hpRatio > 0.3 ? 0xfbbf24 : 0x991b1b;
      }
      if (hpRatio > 0) {
        this.unitHpGraphics.fillStyle(color);
        this.unitHpGraphics.fillRoundedRect(barX + 1, barY + 1, (barW - 2) * hpRatio, barH - 2, 1);

        // Highlight (glass reflection)
        this.unitHpGraphics.fillStyle(0xffffff, 0.25);
        this.unitHpGraphics.fillRect(barX + 1, barY + 1, (barW - 2) * hpRatio, 1);
      }

      // Border — team color tint
      const borderColor = isPlayer ? 0x22c55e : 0xef4444;
      this.unitHpGraphics.lineStyle(1, borderColor, 0.4);
      this.unitHpGraphics.strokeRoundedRect(barX, barY, barW, barH, 2);

      // Overclock indicator (golden glow)
      if (unit.overclocked) {
        this.unitHpGraphics.lineStyle(1, 0xfbbf24, 0.5);
        this.unitHpGraphics.strokeRoundedRect(barX - 1, barY - 1, barW + 2, barH + 2, 3);
      }
    }
  }
}
