import Phaser from 'phaser';
import { Unit } from '../entities/Unit';
import { Tower } from '../entities/Tower';
import { BudgetSystem } from './BudgetSystem';

export class CombatSystem {
  private scene: Phaser.Scene;
  private slowCheckTimer: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  update(
    delta: number,
    playerUnits: Phaser.Physics.Arcade.Group,
    enemyUnits: Phaser.Physics.Arcade.Group,
    towers: Tower[],
    budgetSystem: BudgetSystem,
  ) {
    const dt = delta;

    // Update slow/drain timer
    this.slowCheckTimer += dt;
    const doSlowCheck = this.slowCheckTimer >= 500;
    if (doSlowCheck) this.slowCheckTimer = 0;

    // Get active units
    const activePlayers = playerUnits.getChildren().filter(u => (u as Unit).active) as Unit[];
    const activeEnemies = enemyUnits.getChildren().filter(u => (u as Unit).active) as Unit[];

    // Handle firewall slow aura
    if (doSlowCheck) {
      const firewalls = activePlayers.filter(u => u.special === 'slow');
      for (const enemy of activeEnemies) {
        enemy.isSlowed = false;
        for (const fw of firewalls) {
          const dist = Phaser.Math.Distance.Between(fw.x, fw.y, enemy.x, enemy.y);
          if (dist < 80) {
            enemy.isSlowed = true;
            break;
          }
        }
      }
    }

    // Handle cooling system area DOT
    const coolers = activePlayers.filter(u => u.special === 'area-dot');
    for (const cooler of coolers) {
      for (const enemy of activeEnemies) {
        const dist = Phaser.Math.Distance.Between(cooler.x, cooler.y, enemy.x, enemy.y);
        if (dist < 100) {
          enemy.takeDamage(cooler.getEffectiveDps() * dt / 1000);
        }
      }
    }

    // Handle cryptominer drain
    const miners = activeEnemies.filter(u => u.special === 'drain');
    let totalDrain = 0;
    for (const miner of miners) {
      // Only drain if reached player's territory (y > 400)
      if (miner.y > 400) {
        totalDrain += 0.5;
      }
    }
    // Reset and re-apply drain each frame cycle
    budgetSystem.removeDrain(999);
    if (totalDrain > 0) budgetSystem.addDrain(totalDrain);

    // Assign targets for player units → attack nearest enemy
    for (const unit of activePlayers) {
      if (unit.baseSpeed === 0 && unit.dps === 0) continue; // Firewall has no attack
      if (!unit.target || !unit.target.active) {
        unit.target = this.findNearestEnemy(unit, activeEnemies);
      }
    }

    // Assign targets for enemy units → attack nearest player unit, or tower
    for (const unit of activeEnemies) {
      if (!unit.target || !unit.target.active) {
        unit.target = this.findNearestEnemy(unit, activePlayers);
      }
    }

    // Update all units
    for (const unit of activePlayers) {
      unit.updateUnit(dt);
    }
    for (const unit of activeEnemies) {
      unit.updateUnit(dt);
    }

    // Check enemies hitting towers
    this.checkTowerDamage(activeEnemies, towers, dt);
  }

  private findNearestEnemy(unit: Unit, enemies: Unit[]): Unit | null {
    let nearest: Unit | null = null;
    let nearestDist = Infinity;
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      const dist = Phaser.Math.Distance.Between(unit.x, unit.y, enemy.x, enemy.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    }
    return nearest;
  }

  private checkTowerDamage(enemies: Unit[], towers: Tower[], delta: number) {
    for (const enemy of enemies) {
      if (!enemy.active || enemy.dps === 0) continue;

      for (const tower of towers) {
        if (tower.isDestroyed()) continue;
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, tower.x, tower.y);
        if (dist < 40) {
          // Enemy reached tower, deal damage
          enemy.setVelocity(0, 0);
          enemy.attackTimer += delta;
          if (enemy.attackTimer >= 1000) {
            const dmg = enemy.special === 'dot'
              ? enemy.dps * 1.5  // Ransomware DOT bonus
              : enemy.dps;
            tower.takeDamage(dmg);
            enemy.attackTimer = 0;
          }
        }
      }
    }
  }
}
