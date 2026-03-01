import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import {
  ENEMY_SPAWN_Y,
  PLAYER_DEPLOY_MIN_Y,
  PLAYER_DEPLOY_MAX_Y,
  TOWER_0_X, TOWER_0_Y,
  TOWER_1_X, TOWER_1_Y,
  MAIN_SERVER_X, MAIN_SERVER_Y,
  LANE_TOWER_HP, MAIN_SERVER_HP,
  LANE_0_X, LANE_1_X,
} from '../config/constants';
import { getCardDef, CardDef } from '../config/cards';
import { getEnemyDef, ENEMY_DEFS } from '../config/enemies';
import { Unit } from '../entities/Unit';
import { Tower } from '../entities/Tower';
import { BudgetSystem } from '../systems/BudgetSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { CardSystem } from '../systems/CardSystem';
import { HUD } from '../ui/HUD';
import { CardHand } from '../ui/CardHand';
import { FloatingText } from '../ui/FloatingText';

export class BattleScene extends Phaser.Scene {
  // Systems
  private budgetSystem!: BudgetSystem;
  private combatSystem!: CombatSystem;
  private waveSystem!: WaveSystem;
  private cardSystem!: CardSystem;

  // UI
  private hud!: HUD;
  private cardHand!: CardHand;

  // Entities
  private playerUnits!: Phaser.Physics.Arcade.Group;
  private enemyUnits!: Phaser.Physics.Arcade.Group;
  private towers: Tower[] = [];
  private mainServer!: Tower;

  // Stats
  private unitsDeployed: number = 0;
  private enemiesDefeated: number = 0;
  private startTime: number = 0;

  // Deploy mode
  private deployIndicator!: Phaser.GameObjects.Graphics;
  private isDeploying: boolean = false;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    // Arena background
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'arena-bg').setDepth(0);

    // Init systems
    this.budgetSystem = new BudgetSystem();
    this.combatSystem = new CombatSystem(this);
    this.waveSystem = new WaveSystem();
    this.cardSystem = new CardSystem();
    this.cardSystem.init();

    // Unit groups with pooling
    this.playerUnits = this.physics.add.group({
      classType: Unit,
      maxSize: 50,
      runChildUpdate: false,
    });
    this.enemyUnits = this.physics.add.group({
      classType: Unit,
      maxSize: 80,
      runChildUpdate: false,
    });

    // Create towers
    const tower0 = new Tower(this, TOWER_0_X, TOWER_0_Y, 'server-rack', 'tower-0', LANE_TOWER_HP, 0);
    const tower1 = new Tower(this, TOWER_1_X, TOWER_1_Y, 'server-rack', 'tower-1', LANE_TOWER_HP, 1);
    this.mainServer = new Tower(this, MAIN_SERVER_X, MAIN_SERVER_Y, 'main-server', 'main-server', MAIN_SERVER_HP, -1);
    this.towers = [tower0, tower1, this.mainServer];

    // HUD
    this.hud = new HUD(this);

    // Card hand
    this.cardHand = new CardHand(this, this.cardSystem, (index) => {
      this.onCardSelected(index);
    });
    this.cardHand.create();

    // Deploy indicator (shows where unit will be placed)
    this.deployIndicator = this.add.graphics().setDepth(40).setVisible(false);

    // Click handler for deploying
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.onBattlefieldClick(pointer);
    });

    // Pointer move for deploy preview
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.updateDeployIndicator(pointer);
    });

    // Stats
    this.unitsDeployed = 0;
    this.enemiesDefeated = 0;
    this.startTime = this.time.now;

    // Start first wave after a short delay
    this.waveSystem.waveTimer = GAME_WIDTH; // Will trigger soon
    this.time.delayedCall(3000, () => {
      this.triggerWave();
    });

    // Deploy zone label
    this.add.text(GAME_WIDTH / 2, PLAYER_DEPLOY_MAX_Y + 10, '- DEPLOY ZONE -', {
      fontSize: '10px',
      color: '#335533',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(5);
  }

  update(time: number, delta: number) {
    // Update systems
    this.budgetSystem.update(delta);
    this.combatSystem.update(delta, this.playerUnits, this.enemyUnits, this.towers, this.budgetSystem);

    // Wave check
    if (this.waveSystem.update(delta)) {
      this.triggerWave();
    }

    // Spawn pending enemy attacks
    const attack = this.waveSystem.getPopAttack(delta);
    if (attack) {
      this.spawnEnemy(attack.unit, attack.lane);
    }

    // Check enemy deaths (for score)
    const enemies = this.enemyUnits.getChildren() as Unit[];
    for (const enemy of enemies) {
      if (enemy.active && enemy.hp <= 0) {
        this.enemiesDefeated++;
      }
    }

    // Clean up off-screen enemies (past player towers)
    for (const enemy of enemies) {
      if (enemy.active && enemy.y > GAME_HEIGHT) {
        enemy.die();
      }
    }

    // Clean up off-screen player units
    const players = this.playerUnits.getChildren() as Unit[];
    for (const player of players) {
      if (player.active && player.y < -20) {
        player.die();
      }
    }

    // UI update
    this.hud.update(this.budgetSystem, this.waveSystem);
    this.hud.drawUnitHpBars(this.playerUnits);
    this.hud.drawUnitHpBars(this.enemyUnits);
    this.cardHand.update(this.budgetSystem);

    // Check game over
    if (this.mainServer.isDestroyed()) {
      this.gameOver();
    }
  }

  private onCardSelected(index: number) {
    this.cardSystem.selectCard(index);
    const selected = this.cardSystem.getSelectedCard();
    this.isDeploying = selected !== null;
    this.deployIndicator.setVisible(this.isDeploying);
  }

  private onBattlefieldClick(pointer: Phaser.Input.Pointer) {
    const selected = this.cardSystem.getSelectedCard();
    if (!selected) return;

    // Check if clicking in deploy zone (not on card tray)
    if (pointer.y > 670) return; // Card tray zone

    // Spells can target anywhere
    if (selected.type === 'spell') {
      this.playSpell(selected, pointer.x, pointer.y);
      return;
    }

    // Units must be placed in deploy zone
    if (pointer.y < PLAYER_DEPLOY_MIN_Y || pointer.y > PLAYER_DEPLOY_MAX_Y) {
      FloatingText.show(this, pointer.x, pointer.y, 'Deploy zone only!', '#ff4444');
      return;
    }

    // Check budget
    if (!this.budgetSystem.canAfford(selected.cost)) {
      FloatingText.show(this, pointer.x, pointer.y, 'Not enough budget!', '#ff4444');
      return;
    }

    // Deploy unit
    this.budgetSystem.spend(selected.cost);
    const lane = pointer.x < GAME_WIDTH / 2 ? 0 : 1;
    this.spawnPlayerUnit(selected, pointer.x, pointer.y, lane);
    this.cardSystem.playCard(this.cardSystem.selectedCardIndex);
    this.isDeploying = false;
    this.deployIndicator.setVisible(false);
    this.unitsDeployed++;
  }

  private playSpell(card: CardDef, x: number, y: number) {
    if (!this.budgetSystem.canAfford(card.cost)) {
      FloatingText.show(this, x, y, 'Not enough budget!', '#ff4444');
      return;
    }

    this.budgetSystem.spend(card.cost);

    switch (card.spellEffect) {
      case 'heal': {
        // Heal the nearest tower
        let nearest: Tower | null = null;
        let nearestDist = Infinity;
        for (const tower of this.towers) {
          if (tower.isDestroyed()) continue;
          const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = tower;
          }
        }
        if (nearest) {
          nearest.heal(card.spellValue || 200);
          FloatingText.show(this, nearest.x, nearest.y, `+${card.spellValue} HP`, '#22cc66', 18);
          // Heal effect
          const fx = this.add.image(nearest.x, nearest.y, 'heal-effect').setDepth(30).setAlpha(0.6);
          this.tweens.add({ targets: fx, alpha: 0, scale: 2, duration: 600, onComplete: () => fx.destroy() });
        }
        break;
      }
      case 'push': {
        // Push all enemies in one lane to the other
        const clickLane = x < GAME_WIDTH / 2 ? 0 : 1;
        const targetX = clickLane === 0 ? LANE_1_X : LANE_0_X;
        const enemies = this.enemyUnits.getChildren() as Unit[];
        for (const enemy of enemies) {
          if (!enemy.active) continue;
          if (enemy.lane === clickLane) {
            enemy.lane = clickLane === 0 ? 1 : 0;
            this.tweens.add({ targets: enemy, x: targetX + Phaser.Math.Between(-30, 30), duration: 300 });
          }
        }
        FloatingText.show(this, x, y, 'LOAD BALANCED!', '#6666ff', 16);
        break;
      }
      case 'overclock': {
        const units = this.playerUnits.getChildren() as Unit[];
        for (const unit of units) {
          if (!unit.active) continue;
          unit.overclocked = true;
          // Tint
          unit.setTint(0xffdd22);
        }
        FloatingText.show(this, GAME_WIDTH / 2, 300, 'OVERCLOCK!', '#ffdd22', 20);
        this.time.delayedCall(card.spellDuration || 5000, () => {
          const u = this.playerUnits.getChildren() as Unit[];
          for (const unit of u) {
            unit.overclocked = false;
            unit.clearTint();
          }
        });
        break;
      }
    }

    this.cardSystem.playCard(this.cardSystem.selectedCardIndex);
    this.isDeploying = false;
    this.deployIndicator.setVisible(false);
    this.unitsDeployed++;
  }

  private spawnPlayerUnit(card: CardDef, x: number, y: number, lane: number) {
    const unit = this.playerUnits.get(x, y, card.texture) as Unit;
    if (!unit) return;
    unit.init({
      id: card.id,
      side: 'player',
      hp: card.hp || 100,
      maxHp: card.hp || 100,
      dps: card.dps || 0,
      range: card.range || 0,
      speed: card.speed || 0,
      special: card.special,
      lane,
    });

    // Deploy effect
    FloatingText.show(this, x, y, card.name, '#22cc66');
  }

  private spawnEnemy(unitId: string, lane: number) {
    // Handle ddos-mini (swarm individual)
    const isDdosMini = unitId === 'ddos-mini';
    const defId = isDdosMini ? 'ddos-swarm' : unitId;
    const def = getEnemyDef(defId);
    if (!def) return;

    const laneX = lane === 0 ? LANE_0_X : LANE_1_X;
    const x = laneX + Phaser.Math.Between(-25, 25);
    const y = ENEMY_SPAWN_Y + Phaser.Math.Between(-10, 10);

    const texture = isDdosMini ? 'ddos-mini' : def.texture;
    const hp = isDdosMini ? 30 : (def.hp || 100);
    const dps = isDdosMini ? 8 : (def.dps || 10);
    const speed = isDdosMini ? 100 : (def.speed || 80);

    // Spell-type enemies
    if (def.type === 'spell' && !isDdosMini) {
      this.doEnemySpell(def, lane);
      return;
    }

    const unit = this.enemyUnits.get(x, y, texture) as Unit;
    if (!unit) return;
    unit.init({
      id: unitId,
      side: 'enemy',
      hp,
      maxHp: hp,
      dps,
      range: 30,
      speed,
      special: def.special,
      lane,
    });
  }

  private doEnemySpell(def: any, lane: number) {
    if (def.id === 'power-surge') {
      const targetX = lane === 0 ? LANE_0_X : LANE_1_X;
      const targetY = Phaser.Math.Between(400, 550);

      // Visual
      const fx = this.add.image(targetX, targetY, 'power-surge').setDepth(30).setScale(0.5);
      this.tweens.add({
        targets: fx,
        scale: 2,
        alpha: 0,
        duration: 800,
        onComplete: () => fx.destroy(),
      });

      // Damage player units in area
      const players = this.playerUnits.getChildren() as Unit[];
      for (const unit of players) {
        if (!unit.active) continue;
        const dist = Phaser.Math.Distance.Between(targetX, targetY, unit.x, unit.y);
        if (dist < (def.spellRadius || 80)) {
          unit.takeDamage(def.spellDamage || 150);
          FloatingText.show(this, unit.x, unit.y, `-${def.spellDamage || 150}`, '#ffaa00');
        }
      }

      // Also damage towers
      for (const tower of this.towers) {
        if (tower.isDestroyed()) continue;
        const dist = Phaser.Math.Distance.Between(targetX, targetY, tower.x, tower.y);
        if (dist < (def.spellRadius || 80)) {
          tower.takeDamage(Math.floor((def.spellDamage || 150) / 2));
        }
      }

      FloatingText.show(this, targetX, targetY, 'POWER SURGE!', '#ffaa00', 16);
    }
  }

  private async triggerWave() {
    this.waveSystem.startNextWave();
    this.budgetSystem.updateRegenForWave(this.waveSystem.wave);

    FloatingText.showAnnouncement(this, `WAVE ${this.waveSystem.wave}`);

    // Try AI opponent
    this.waveSystem.setFetching(true);
    try {
      const plan = await this.fetchAIPlan();
      this.waveSystem.setAttackPlan(plan);
      if (plan.announcement) {
        this.time.delayedCall(800, () => {
          FloatingText.showAnnouncement(this, `INCOMING: ${plan.announcement}`);
        });
      }
    } catch (e) {
      console.warn('AI opponent failed, using fallback:', e);
      const fallback = this.waveSystem.generateFallbackPlan();
      this.waveSystem.setAttackPlan(fallback);
    }
  }

  private async fetchAIPlan() {
    const gameState = this.serializeGameState();
    const response = await fetch('/api/opponent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameState),
    });

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`);
    }

    return response.json();
  }

  private serializeGameState() {
    const playerPositions: { id: string; x: number; y: number; hp: number; lane: number }[] = [];
    const players = this.playerUnits.getChildren() as Unit[];
    for (const u of players) {
      if (!u.active) continue;
      playerPositions.push({ id: u.unitId, x: u.x, y: u.y, hp: u.hp, lane: u.lane });
    }

    return {
      wave: this.waveSystem.wave,
      enemyBudget: this.waveSystem.enemyBudget,
      towers: this.towers.map(t => ({
        id: t.towerId,
        hp: t.hp,
        maxHp: t.maxHp,
        lane: t.lane,
      })),
      playerUnits: playerPositions,
      playerBudget: this.budgetSystem.budget,
    };
  }

  private updateDeployIndicator(pointer: Phaser.Input.Pointer) {
    if (!this.isDeploying) return;

    this.deployIndicator.clear();
    const inZone = pointer.y >= PLAYER_DEPLOY_MIN_Y && pointer.y <= PLAYER_DEPLOY_MAX_Y && pointer.y < 670;

    this.deployIndicator.lineStyle(2, inZone ? 0x22cc66 : 0xff3333, 0.6);
    this.deployIndicator.strokeCircle(pointer.x, pointer.y, 15);

    if (inZone) {
      this.deployIndicator.fillStyle(0x22cc66, 0.15);
      this.deployIndicator.fillCircle(pointer.x, pointer.y, 15);
    }
  }

  private gameOver() {
    const elapsed = (this.time.now - this.startTime) / 1000;
    const maxHp = LANE_TOWER_HP * 2 + MAIN_SERVER_HP;
    const remainingHp = this.towers.reduce((sum, t) => sum + Math.max(0, t.hp), 0);
    const uptimePercent = Math.round((remainingHp / maxHp) * 100);

    this.scene.start('GameOverScene', {
      wave: this.waveSystem.wave,
      uptime: uptimePercent,
      unitsDeployed: this.unitsDeployed,
      enemiesDefeated: this.enemiesDefeated,
      elapsed: Math.round(elapsed),
    });
  }
}
