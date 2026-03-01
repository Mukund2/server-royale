import * as Phaser from 'phaser';
import { MELEE_RANGE } from '../config/constants';
import { FloatingText } from '../ui/FloatingText';

export type UnitSide = 'player' | 'enemy';

export interface UnitConfig {
  id: string;
  side: UnitSide;
  hp: number;
  maxHp: number;
  dps: number;
  range: number;
  speed: number;
  special?: string;
  lane: number;
}

export class Unit extends Phaser.Physics.Arcade.Sprite {
  unitId: string = '';
  side: UnitSide = 'player';
  hp: number = 0;
  maxHp: number = 0;
  dps: number = 0;
  range: number = 0;
  baseSpeed: number = 0;
  special: string = '';
  lane: number = 0;
  target: Unit | null = null;
  attackTimer: number = 0;
  isSlowed: boolean = false;
  overclocked: boolean = false;
  lifetime: number = -1; // -1 = infinite
  drainTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  init(config: UnitConfig) {
    this.unitId = config.id;
    this.side = config.side;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.dps = config.dps;
    this.range = config.range || MELEE_RANGE;
    this.baseSpeed = config.speed;
    this.special = config.special || '';
    this.lane = config.lane;
    this.target = null;
    this.attackTimer = 0;
    this.isSlowed = false;
    this.overclocked = false;
    this.drainTimer = 0;
    this.setActive(true);
    this.setVisible(true);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = true;
    }

    // Lifetime for cooling system
    if (this.special === 'area-dot') {
      this.lifetime = 10000;
    } else {
      this.lifetime = -1;
    }

    // Flip enemy units to face down
    if (this.side === 'enemy') {
      this.setFlipY(true);
    } else {
      this.setFlipY(false);
    }
  }

  getEffectiveSpeed(): number {
    let speed = this.baseSpeed;
    if (this.isSlowed) speed *= 0.5;
    if (this.overclocked) speed *= 1.5;
    return speed;
  }

  getEffectiveDps(): number {
    let dps = this.dps;
    if (this.overclocked) dps *= 1.5;
    return dps;
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.target = null;

    // Death explosion particles
    if (this.scene && this.visible) {
      const deathColors = this.side === 'player'
        ? [0x4ade80, 0x22c55e, 0xffffff]
        : [0xef4444, 0xff8c00, 0xfbbf24];

      // Burst particles
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const dist = 15 + Math.random() * 10;
        const color = deathColors[Math.floor(Math.random() * deathColors.length)];
        const p = this.scene.add.circle(this.x, this.y, 3 + Math.random() * 2, color, 0.9).setDepth(50);
        this.scene.tweens.add({
          targets: p,
          x: this.x + Math.cos(angle) * dist,
          y: this.y + Math.sin(angle) * dist,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 300 + Math.random() * 200,
          onComplete: () => p.destroy(),
        });
      }

      // Pop flash
      const flash = this.scene.add.circle(this.x, this.y, 12, 0xffffff, 0.6).setDepth(49);
      this.scene.tweens.add({
        targets: flash,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 200,
        onComplete: () => flash.destroy(),
      });
    }

    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.setPosition(-100, -100);
  }

  updateUnit(delta: number) {
    if (!this.active) return;

    // Lifetime check
    if (this.lifetime > 0) {
      this.lifetime -= delta;
      if (this.lifetime <= 0) {
        this.die();
        return;
      }
    }

    // If stationary unit (firewall, cooling), don't move
    if (this.baseSpeed === 0) return;

    // If has a target and in range, attack
    if (this.target && this.target.active) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (dist <= this.range) {
        // Stop moving, attack
        this.setVelocity(0, 0);
        this.attackTimer += delta;
        if (this.attackTimer >= 1000) {
          this.performAttack();
          this.attackTimer = 0;
        }
        return;
      }
    }

    // Move toward enemy towers or enemy units
    const speed = this.getEffectiveSpeed();
    const direction = this.side === 'player' ? -1 : 1;
    this.setVelocity(0, speed * direction);
  }

  private performAttack() {
    if (!this.target || !this.target.active) return;

    // Glitch check for AI Bot
    if (this.special === 'glitch' && Math.random() < 0.15) {
      return; // Glitched, skip attack
    }

    const damage = this.getEffectiveDps();
    const killed = this.target.takeDamage(damage);

    // Damage number
    if (this.scene && this.target) {
      FloatingText.showDamageNumber(this.scene, this.target.x + Phaser.Math.Between(-5, 5), this.target.y - 10, damage, this.overclocked);
    }

    // Attack visual feedback
    if (this.scene) {
      // Attacker lunge
      const origX = this.x, origY = this.y;
      const dx = (this.target.x - this.x) * 0.15;
      const dy = (this.target.y - this.y) * 0.15;
      this.scene.tweens.add({
        targets: this,
        x: origX + dx,
        y: origY + dy,
        duration: 60,
        yoyo: true,
        ease: 'Power2',
      });

      // Hit flash on target
      if (this.target.active) {
        this.target.setTint(0xffffff);
        this.scene.time.delayedCall(80, () => {
          if (this.target && this.target.active) {
            this.target.clearTint();
          }
        });
      }

      // Attack line flash
      const lineColor = this.side === 'player' ? 0x4ade80 : 0xef4444;
      const line = this.scene.add.graphics().setDepth(35);
      line.lineStyle(2, lineColor, 0.6);
      line.lineBetween(this.x, this.y, this.target.x, this.target.y);
      this.scene.tweens.add({
        targets: line,
        alpha: 0,
        duration: 150,
        onComplete: () => line.destroy(),
      });
    }

    if (!this.target.active) {
      this.target = null;
    }
  }
}
