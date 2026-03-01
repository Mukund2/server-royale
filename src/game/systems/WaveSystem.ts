import {
  WAVE_INTERVAL,
  STARTING_ENEMY_BUDGET,
  ENEMY_BUDGET_SCALE,
} from '../config/constants';
import { ENEMY_DEFS, EnemyDef } from '../config/enemies';

export interface AttackPlan {
  attacks: { unit: string; lane: number; delay: number }[];
  announcement: string;
}

export class WaveSystem {
  wave: number = 0;
  waveTimer: number = 0;
  enemyBudget: number = STARTING_ENEMY_BUDGET;
  isWaveActive: boolean = false;
  pendingAttacks: { unit: string; lane: number; delay: number }[] = [];
  currentAnnouncement: string = '';
  private fetchingAI: boolean = false;

  update(delta: number): boolean {
    this.waveTimer += delta;
    if (this.waveTimer >= WAVE_INTERVAL && !this.fetchingAI) {
      return true; // Time to trigger next wave
    }
    return false;
  }

  startNextWave() {
    this.wave++;
    this.waveTimer = 0;
    this.enemyBudget = STARTING_ENEMY_BUDGET + (this.wave - 1) * ENEMY_BUDGET_SCALE;
    this.isWaveActive = true;
  }

  setAttackPlan(plan: AttackPlan) {
    this.pendingAttacks = [...plan.attacks];
    this.currentAnnouncement = plan.announcement;
    this.fetchingAI = false;
  }

  setFetching(fetching: boolean) {
    this.fetchingAI = fetching;
  }

  // Generate a fallback random attack plan (if Mistral API fails)
  generateFallbackPlan(): AttackPlan {
    const budget = this.enemyBudget;
    const attacks: { unit: string; lane: number; delay: number }[] = [];
    let spent = 0;

    const availableUnits = ENEMY_DEFS.filter(e => e.type === 'unit');

    while (spent < budget) {
      const def = availableUnits[Math.floor(Math.random() * availableUnits.length)];
      if (spent + def.cost > budget) break;

      if (def.id === 'ddos-swarm') {
        // Spawn 5 minis
        for (let i = 0; i < 5; i++) {
          attacks.push({
            unit: 'ddos-mini',
            lane: Math.random() < 0.5 ? 0 : 1,
            delay: i * 300,
          });
        }
      } else {
        attacks.push({
          unit: def.id,
          lane: Math.random() < 0.5 ? 0 : 1,
          delay: attacks.length * 500,
        });
      }
      spent += def.cost;
    }

    const taunts = [
      'Incoming heat wave!',
      'Your servers can\'t handle this!',
      'Deploying countermeasures...',
      'Time to stress test your defenses!',
      'Overloading your systems!',
    ];

    return {
      attacks,
      announcement: taunts[Math.floor(Math.random() * taunts.length)],
    };
  }

  getPopAttack(delta: number): { unit: string; lane: number } | null {
    if (this.pendingAttacks.length === 0) {
      this.isWaveActive = false;
      return null;
    }

    // Decrease delay on first attack
    this.pendingAttacks[0].delay -= delta;
    if (this.pendingAttacks[0].delay <= 0) {
      return this.pendingAttacks.shift()!;
    }
    return null;
  }

  reset() {
    this.wave = 0;
    this.waveTimer = 0;
    this.enemyBudget = STARTING_ENEMY_BUDGET;
    this.isWaveActive = false;
    this.pendingAttacks = [];
    this.currentAnnouncement = '';
    this.fetchingAI = false;
  }
}
