import * as Phaser from 'phaser';

export class Tower extends Phaser.GameObjects.Sprite {
  towerId: string;
  hp: number;
  maxHp: number;
  lane: number; // -1 for main server
  hpBar: Phaser.GameObjects.Graphics | null = null;

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

    // Create HP bar
    this.hpBar = scene.add.graphics();
    this.updateHpBar();
  }

  takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    this.updateHpBar();

    // Screen shake
    if (amount > 0) {
      this.scene.cameras.main.shake(100, 0.005);
    }

    return this.hp <= 0;
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.updateHpBar();
  }

  private updateHpBar() {
    if (!this.hpBar) return;
    this.hpBar.clear();

    const barWidth = this.displayWidth + 10;
    const barHeight = 6;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.displayHeight / 2 - 12;

    // Background
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(barX, barY, barWidth, barHeight);

    // HP fill
    const hpRatio = this.hp / this.maxHp;
    const color = hpRatio > 0.5 ? 0x22cc66 : hpRatio > 0.25 ? 0xffaa00 : 0xff3333;
    this.hpBar.fillStyle(color);
    this.hpBar.fillRect(barX, barY, barWidth * hpRatio, barHeight);

    // Border
    this.hpBar.lineStyle(1, 0xffffff, 0.3);
    this.hpBar.strokeRect(barX, barY, barWidth, barHeight);
  }

  isDestroyed(): boolean {
    return this.hp <= 0;
  }

  destroy(fromScene?: boolean) {
    if (this.hpBar) {
      this.hpBar.destroy();
      this.hpBar = null;
    }
    super.destroy(fromScene);
  }
}
