import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';
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

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Wave counter banner (top center, Clash Royale style)
    this.waveBg = scene.add.graphics().setDepth(50);
    this.waveText = scene.add.text(GAME_WIDTH / 2, 16, 'WAVE 0', {
      fontSize: '16px',
      color: '#fbbf24',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5).setDepth(51);

    // Budget/Elixir bar
    this.budgetBar = scene.add.graphics().setDepth(55);
    this.elixirDrops = scene.add.graphics().setDepth(55);

    // Budget text
    this.budgetText = scene.add.text(GAME_WIDTH - 12, GAME_HEIGHT - 82, '5', {
      fontSize: '18px',
      color: '#e9d5ff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(56);

    // HP bar renderer for units
    this.unitHpGraphics = scene.add.graphics().setDepth(45);
  }

  update(budget: BudgetSystem, wave: WaveSystem) {
    this.drawWaveBanner(wave.wave);
    this.drawBudgetBar(budget);
  }

  private drawWaveBanner(waveNum: number) {
    this.waveBg.clear();

    // Banner background
    const bw = 100, bh = 26;
    const bx = GAME_WIDTH / 2 - bw / 2;
    const by = 3;

    // Shadow
    this.waveBg.fillStyle(0x000000, 0.5);
    this.waveBg.fillRoundedRect(bx + 2, by + 2, bw, bh, 6);
    // Banner
    this.waveBg.fillStyle(0x7c2d12);
    this.waveBg.fillRoundedRect(bx, by, bw, bh, 6);
    // Highlight
    this.waveBg.fillStyle(0x9a3412);
    this.waveBg.fillRoundedRect(bx, by, bw, bh / 2, { tl: 6, tr: 6, bl: 0, br: 0 });
    // Gold border
    this.waveBg.lineStyle(1.5, 0xfbbf24, 0.8);
    this.waveBg.strokeRoundedRect(bx, by, bw, bh, 6);

    this.waveText.setText(`WAVE ${waveNum}`);
  }

  private drawBudgetBar(budget: BudgetSystem) {
    this.budgetBar.clear();
    this.elixirDrops.clear();

    const barX = 12;
    const barY = GAME_HEIGHT - 90;
    const barW = GAME_WIDTH - 55;
    const barH = 16;

    // Bar shadow
    this.budgetBar.fillStyle(0x000000, 0.5);
    this.budgetBar.fillRoundedRect(barX + 1, barY + 2, barW, barH, 6);

    // Bar background
    this.budgetBar.fillStyle(0x1a1040);
    this.budgetBar.fillRoundedRect(barX, barY, barW, barH, 6);

    // Elixir fill (purple gradient effect)
    const ratio = budget.budget / budget.maxBudget;
    if (ratio > 0) {
      const fillW = barW * ratio;
      // Dark purple base
      this.budgetBar.fillStyle(0x7c3aed);
      this.budgetBar.fillRoundedRect(barX + 1, barY + 1, fillW - 2, barH - 2, 5);
      // Brighter top half
      this.budgetBar.fillStyle(0xa855f7, 0.5);
      this.budgetBar.fillRoundedRect(barX + 2, barY + 2, fillW - 4, barH / 2 - 1, { tl: 4, tr: 4, bl: 0, br: 0 });
      // Highlight shine
      this.budgetBar.fillStyle(0xffffff, 0.15);
      this.budgetBar.fillRoundedRect(barX + 4, barY + 3, fillW / 2, 4, 3);
    }

    // Segment lines
    this.budgetBar.lineStyle(1, 0x000000, 0.3);
    for (let i = 1; i < budget.maxBudget; i++) {
      const sx = barX + (barW / budget.maxBudget) * i;
      this.budgetBar.lineBetween(sx, barY + 2, sx, barY + barH - 2);
    }

    // Border
    this.budgetBar.lineStyle(2, 0x6d28d9, 0.8);
    this.budgetBar.strokeRoundedRect(barX, barY, barW, barH, 6);
    // Outer gold accent
    this.budgetBar.lineStyle(1, 0xfbbf24, 0.3);
    this.budgetBar.strokeRoundedRect(barX - 1, barY - 1, barW + 2, barH + 2, 7);

    // Elixir drop icon (left of text)
    const dropX = GAME_WIDTH - 38;
    const dropY = barY + barH / 2;
    this.elixirDrops.fillStyle(0x9333ea);
    this.elixirDrops.fillCircle(dropX, dropY, 8);
    // Drop highlight
    this.elixirDrops.fillStyle(0xc084fc, 0.5);
    this.elixirDrops.fillCircle(dropX - 2, dropY - 2, 3);
    this.elixirDrops.lineStyle(1.5, 0xfbbf24, 0.6);
    this.elixirDrops.strokeCircle(dropX, dropY, 8);

    this.budgetText.setText(`${Math.floor(budget.budget)}`);
  }

  drawUnitHpBars(units: Phaser.Physics.Arcade.Group) {
    this.unitHpGraphics.clear();

    const children = units.getChildren() as Phaser.Physics.Arcade.Sprite[];
    for (const sprite of children) {
      const unit = sprite as any;
      if (!unit.active || !unit.hp || !unit.maxHp) continue;

      const barW = 22;
      const barH = 4;
      const barX = unit.x - barW / 2;
      const barY = unit.y - unit.displayHeight / 2 - 8;

      // Shadow
      this.unitHpGraphics.fillStyle(0x000000, 0.5);
      this.unitHpGraphics.fillRect(barX + 1, barY + 1, barW, barH);

      // BG
      this.unitHpGraphics.fillStyle(0x1a1a2e);
      this.unitHpGraphics.fillRect(barX, barY, barW, barH);

      // Fill
      const hpRatio = unit.hp / unit.maxHp;
      const color = hpRatio > 0.6 ? 0x22c55e : hpRatio > 0.3 ? 0xfbbf24 : 0xef4444;
      this.unitHpGraphics.fillStyle(color);
      this.unitHpGraphics.fillRect(barX, barY, barW * hpRatio, barH);

      // Highlight
      this.unitHpGraphics.fillStyle(0xffffff, 0.2);
      this.unitHpGraphics.fillRect(barX, barY, barW * hpRatio, barH / 2);

      // Border
      this.unitHpGraphics.lineStyle(1, 0x000000, 0.7);
      this.unitHpGraphics.strokeRect(barX, barY, barW, barH);
    }
  }
}
