import * as Phaser from 'phaser';
import { MELEE_RANGE } from '../config/constants';

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
    this.target.takeDamage(damage);

    if (!this.target.active) {
      this.target = null;
    }
  }
}
