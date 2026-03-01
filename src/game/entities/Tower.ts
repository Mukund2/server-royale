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

    if (amount > 0) {
      // Screen shake — bigger for main server
      const intensity = this.lane === -1 ? 0.008 : 0.004;
      this.scene.cameras.main.shake(120, intensity);

      // Flash red tint
      this.setTint(0xff4444);
      this.scene.time.delayedCall(100, () => this.clearTint());

      // Sprite shake (offset jitter)
      const origX = this.x;
      this.scene.tweens.add({
        targets: this,
        x: origX + 3,
        duration: 30,
        yoyo: true,
        repeat: 2,
        onComplete: () => { this.x = origX; },
      });

      // Damage spark particles
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 15;
        const colors = [0xef4444, 0xff8c00, 0xfbbf24, 0xffffff];
        const p = this.scene.add.circle(
          this.x, this.y - 10,
          2 + Math.random() * 2,
          colors[i % colors.length], 0.9,
        ).setDepth(20);
        this.scene.tweens.add({
          targets: p,
          x: this.x + Math.cos(angle) * dist,
          y: this.y - 10 + Math.sin(angle) * dist,
          alpha: 0,
          scaleX: 0.2,
          scaleY: 0.2,
          duration: 250 + Math.random() * 150,
          onComplete: () => p.destroy(),
        });
      }

      // Red flash ring around tower
      if (this.hp / this.maxHp < 0.4) {
        const ring = this.scene.add.graphics().setDepth(14);
        ring.lineStyle(2, 0xef4444, 0.5);
        ring.strokeCircle(this.x, this.y, 20);
        this.scene.tweens.add({
          targets: ring,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 300,
          onComplete: () => ring.destroy(),
        });
      }
    }

    return this.hp <= 0;
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.updateHpBar();
    // Flash green
    this.setTint(0x44ff88);
    this.scene.time.delayedCall(200, () => this.clearTint());

    // Rising green heal particles
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.circle(
        this.x + Phaser.Math.Between(-15, 15),
        this.y + Phaser.Math.Between(-5, 10),
        Phaser.Math.Between(2, 4),
        i % 2 === 0 ? 0x22c55e : 0x4ade80,
        0.7,
      ).setDepth(20);
      this.scene.tweens.add({
        targets: p,
        y: p.y - 30 - Math.random() * 15,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 500 + Math.random() * 300,
        delay: i * 50,
        onComplete: () => p.destroy(),
      });
    }

    // Green pulse ring
    const ring = this.scene.add.graphics().setDepth(14);
    ring.lineStyle(2, 0x22c55e, 0.5);
    ring.strokeCircle(this.x, this.y, 10);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 600,
      onComplete: () => ring.destroy(),
    });
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
