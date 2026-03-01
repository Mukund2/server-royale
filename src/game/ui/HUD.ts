import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants';
import { BudgetSystem } from '../systems/BudgetSystem';
import { WaveSystem } from '../systems/WaveSystem';

export class HUD {
  private scene: Phaser.Scene;
  private budgetBar: Phaser.GameObjects.Graphics;
  private budgetText: Phaser.GameObjects.Text;
  private waveText: Phaser.GameObjects.Text;
  private unitHpGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Budget bar background + fill
    this.budgetBar = scene.add.graphics().setDepth(50);

    // Budget text
    this.budgetText = scene.add.text(GAME_WIDTH - 10, 672, '5/10', {
      fontSize: '14px',
      color: '#bb88ff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5).setDepth(50);

    // Wave counter
    this.waveText = scene.add.text(GAME_WIDTH / 2, 14, 'WAVE 0', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setDepth(50);

    // HP bar renderer for units
    this.unitHpGraphics = scene.add.graphics().setDepth(45);
  }

  update(budget: BudgetSystem, wave: WaveSystem) {
    // Budget bar
    this.budgetBar.clear();
    const barX = 10;
    const barY = 665;
    const barW = GAME_WIDTH - 80;
    const barH = 14;

    // BG
    this.budgetBar.fillStyle(0x222244);
    this.budgetBar.fillRoundedRect(barX, barY, barW, barH, 4);

    // Fill
    const ratio = budget.budget / budget.maxBudget;
    this.budgetBar.fillStyle(0x8844dd);
    this.budgetBar.fillRoundedRect(barX, barY, barW * ratio, barH, 4);

    // Segments
    this.budgetBar.lineStyle(1, 0x000000, 0.3);
    for (let i = 1; i < budget.maxBudget; i++) {
      const sx = barX + (barW / budget.maxBudget) * i;
      this.budgetBar.lineBetween(sx, barY, sx, barY + barH);
    }

    // Border
    this.budgetBar.lineStyle(1, 0x6633bb, 0.8);
    this.budgetBar.strokeRoundedRect(barX, barY, barW, barH, 4);

    this.budgetText.setText(`${Math.floor(budget.budget)}/${budget.maxBudget}`);
    this.waveText.setText(`WAVE ${wave.wave}`);
  }

  drawUnitHpBars(units: Phaser.Physics.Arcade.Group) {
    this.unitHpGraphics.clear();

    const children = units.getChildren() as Phaser.Physics.Arcade.Sprite[];
    for (const sprite of children) {
      const unit = sprite as any;
      if (!unit.active || !unit.hp || !unit.maxHp) continue;

      const barW = 20;
      const barH = 3;
      const barX = unit.x - barW / 2;
      const barY = unit.y - unit.displayHeight / 2 - 6;

      // BG
      this.unitHpGraphics.fillStyle(0x333333);
      this.unitHpGraphics.fillRect(barX, barY, barW, barH);

      // Fill
      const hpRatio = unit.hp / unit.maxHp;
      const color = hpRatio > 0.5 ? 0x22cc66 : hpRatio > 0.25 ? 0xffaa00 : 0xff3333;
      this.unitHpGraphics.fillStyle(color);
      this.unitHpGraphics.fillRect(barX, barY, barW * hpRatio, barH);
    }
  }
}
