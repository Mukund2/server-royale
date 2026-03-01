import {
  STARTING_BUDGET,
  MAX_BUDGET,
  BASE_REGEN_RATE,
  SLOW_REGEN_RATE,
  CRISIS_REGEN_RATE,
} from '../config/constants';

export class BudgetSystem {
  budget: number = STARTING_BUDGET;
  maxBudget: number = MAX_BUDGET;
  regenRate: number = BASE_REGEN_RATE;
  private drainRate: number = 0;

  update(delta: number) {
    const dt = delta / 1000;
    this.budget = Math.min(this.maxBudget, this.budget + (this.regenRate - this.drainRate) * dt);
    if (this.budget < 0) this.budget = 0;
  }

  canAfford(cost: number): boolean {
    return this.budget >= cost;
  }

  spend(cost: number): boolean {
    if (!this.canAfford(cost)) return false;
    this.budget -= cost;
    return true;
  }

  updateRegenForWave(wave: number) {
    if (wave > 10) {
      this.regenRate = CRISIS_REGEN_RATE;
    } else if (wave > 5) {
      this.regenRate = SLOW_REGEN_RATE;
    } else {
      this.regenRate = BASE_REGEN_RATE;
    }
  }

  addDrain(amount: number) {
    this.drainRate += amount;
  }

  removeDrain(amount: number) {
    this.drainRate = Math.max(0, this.drainRate - amount);
  }

  reset() {
    this.budget = STARTING_BUDGET;
    this.regenRate = BASE_REGEN_RATE;
    this.drainRate = 0;
  }
}
