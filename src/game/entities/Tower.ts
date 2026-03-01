import * as Phaser from 'phaser';

export class Tower extends Phaser.GameObjects.Sprite {
  towerId: string;
  hp: number;
  maxHp: number;
  lane: number; // -1 for main server
  hpBar: Phaser.GameObjects.Graphics | null = null;
  hpText: Phaser.GameObjects.Text | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    maxHp: number,
    lane: number
  ) {
    super(scene, x, y, texture);
    this.towerId = id;
    this.hp = maxHp;
    this.maxHp = maxHp;
    this.lane = lane;
    scene.add.existing(this);
    this.setDepth(10);

    // Create HP bar
    this.hpBar = scene.add.graphics().setDepth(15);

    // HP text
    this.hpText = scene.add.text(x, y - this.displayHeight / 2 - 20, `${maxHp}`, {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(16);

    this.updateHpBar();
  }

  takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    this.updateHpBar();

    // Screen shake — bigger for main server
    if (amount > 0) {
      const intensity = this.lane === -1 ? 0.008 : 0.004;
      this.scene.cameras.main.shake(120, intensity);
      // Flash red
      this.setTint(0xff4444);
      this.scene.time.delayedCall(100, () => this.clearTint());
    }

    return this.hp <= 0;
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.updateHpBar();
    // Flash green
    this.setTint(0x44ff88);
    this.scene.time.delayedCall(200, () => this.clearTint());
  }

  private updateHpBar() {
    if (!this.hpBar) return;
    this.hpBar.clear();

    const barWidth = this.lane === -1 ? 66 : 46;
    const barHeight = 8;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.displayHeight / 2 - 14;

    // Shadow
    this.hpBar.fillStyle(0x000000, 0.5);
    this.hpBar.fillRoundedRect(barX + 1, barY + 1, barWidth, barHeight, 3);

    // Background
    this.hpBar.fillStyle(0x1e1e2e);
    this.hpBar.fillRoundedRect(barX, barY, barWidth, barHeight, 3);

    // HP fill
    const hpRatio = this.hp / this.maxHp;
    const color = hpRatio > 0.6 ? 0x22c55e : hpRatio > 0.3 ? 0xfbbf24 : 0xef4444;
    if (hpRatio > 0) {
      this.hpBar.fillStyle(color);
      this.hpBar.fillRoundedRect(barX + 1, barY + 1, (barWidth - 2) * hpRatio, barHeight - 2, 2);
      // Highlight
      this.hpBar.fillStyle(0xffffff, 0.2);
      this.hpBar.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * hpRatio, barHeight / 2 - 1, 2);
    }

    // Border
    this.hpBar.lineStyle(1.5, 0x000000, 0.8);
    this.hpBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 3);

    // HP text
    if (this.hpText) {
      this.hpText.setText(`${Math.ceil(this.hp)}`);
      this.hpText.setPosition(this.x, barY - 8);
    }
  }

  isDestroyed(): boolean {
    return this.hp <= 0;
  }

  destroy(fromScene?: boolean) {
    if (this.hpBar) {
      this.hpBar.destroy();
      this.hpBar = null;
    }
    if (this.hpText) {
      this.hpText.destroy();
      this.hpText = null;
    }
    super.destroy(fromScene);
  }
}
