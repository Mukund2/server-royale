import * as Phaser from 'phaser';
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

  // Tower shooting
  private towerShootTimer: number = 0;
  private towerRangeGraphics!: Phaser.GameObjects.Graphics;
  private towerAuraTimer: number = 0;

  // Ambient effects
  private ambientTimer: number = 0;
  private towerLedTimer: number = 0;
  private enemyTrailTimer: number = 0;
  private riverShimmerTimer: number = 0;

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

    // Card tray background panel (Clash Royale dark tray)
    const trayBg = this.add.graphics().setDepth(55);
    const trayY = 670;
    const trayH = GAME_HEIGHT - trayY;
    // Main tray body
    trayBg.fillStyle(0x1a1736);
    trayBg.fillRoundedRect(4, trayY, GAME_WIDTH - 8, trayH - 4, { tl: 12, tr: 12, bl: 0, br: 0 });
    // Darker inner
    trayBg.fillStyle(0x13102a, 0.8);
    trayBg.fillRoundedRect(8, trayY + 4, GAME_WIDTH - 16, trayH - 10, { tl: 10, tr: 10, bl: 0, br: 0 });
    // Gold trim top
    trayBg.fillStyle(0xfbbf24, 0.4);
    trayBg.fillRect(4, trayY, GAME_WIDTH - 8, 2);
    // Inner gold accent
    trayBg.fillStyle(0xfbbf24, 0.12);
    trayBg.fillRect(10, trayY + 3, GAME_WIDTH - 20, 1);
    // Subtle side gold lines
    trayBg.fillStyle(0xfbbf24, 0.1);
    trayBg.fillRect(4, trayY, 1, trayH - 4);
    trayBg.fillRect(GAME_WIDTH - 5, trayY, 1, trayH - 4);

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

    // "READY?" countdown at battle start
    this.time.delayedCall(500, () => {
      FloatingText.showBigText(this, 'READY?', '#60a5fa');
    });
    this.time.delayedCall(1500, () => {
      FloatingText.showBigText(this, 'DEFEND!', '#22c55e');
    });

    // Start first wave after a short delay
    this.waveSystem.waveTimer = GAME_WIDTH; // Will trigger soon
    this.time.delayedCall(3000, () => {
      this.triggerWave();
    });

    // Tower range indicator graphics
    this.towerRangeGraphics = this.add.graphics().setDepth(4);

    // Deploy zone markers (subtle dashed lines)
    const zoneGfx = this.add.graphics().setDepth(5);
    zoneGfx.lineStyle(1, 0x4ade80, 0.15);
    for (let x = 10; x < GAME_WIDTH - 10; x += 16) {
      zoneGfx.lineBetween(x, PLAYER_DEPLOY_MIN_Y, x + 8, PLAYER_DEPLOY_MIN_Y);
      zoneGfx.lineBetween(x, PLAYER_DEPLOY_MAX_Y, x + 8, PLAYER_DEPLOY_MAX_Y);
    }

    // Fade in
    this.cameras.main.fadeIn(400);
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

    // Tower shooting at enemies
    this.towerShootTimer += delta;
    if (this.towerShootTimer >= 2000) {
      this.towerShootTimer = 0;
      this.towerShootAtEnemies();
    }

    // Tower range indicators (subtle)
    this.drawTowerRanges();

    // Ambient sparkle particles
    this.ambientTimer += delta;
    if (this.ambientTimer >= 800) {
      this.ambientTimer = 0;
      this.spawnAmbientParticle();
    }

    // Tower LED blink
    this.towerLedTimer += delta;
    if (this.towerLedTimer >= 1500) {
      this.towerLedTimer = 0;
      this.blinkTowerLEDs();
    }

    // Enemy trail particles (fire/smoke)
    this.enemyTrailTimer += delta;
    if (this.enemyTrailTimer >= 400) {
      this.enemyTrailTimer = 0;
      this.spawnEnemyTrails();
    }

    // Tower defensive aura pulse
    this.towerAuraTimer += delta;
    if (this.towerAuraTimer >= 3000) {
      this.towerAuraTimer = 0;
      this.pulseTowerAuras();
    }

    // River shimmer sparkles
    this.riverShimmerTimer += delta;
    if (this.riverShimmerTimer >= 600 && this.children.length < 500) {
      this.riverShimmerTimer = 0;
      const sparkX = Phaser.Math.Between(10, GAME_WIDTH - 10);
      const sparkY = 275 + Phaser.Math.Between(5, 33);
      const sparkle = this.add.circle(sparkX, sparkY, 1.5, 0xffffff, 0.5).setDepth(3);
      this.tweens.add({
        targets: sparkle,
        x: sparkX + Phaser.Math.Between(-8, 8),
        alpha: 0,
        duration: 800,
        onComplete: () => sparkle.destroy(),
      });
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
            // Wind trail behind pushed enemies
            const trail = this.add.circle(enemy.x, enemy.y, 3, 0x60a5fa, 0.5).setDepth(25);
            this.tweens.add({
              targets: trail,
              x: targetX,
              alpha: 0,
              scaleX: 0.2,
              scaleY: 0.2,
              duration: 300,
              onComplete: () => trail.destroy(),
            });
          }
        }
        FloatingText.showBigText(this, 'LOAD BALANCED!', '#60a5fa');
        // Blue flash
        this.cameras.main.flash(150, 96, 165, 250, false, undefined, this);
        break;
      }
      case 'overclock': {
        const units = this.playerUnits.getChildren() as Unit[];
        for (const unit of units) {
          if (!unit.active) continue;
          unit.overclocked = true;
          unit.setTint(0xffdd22);

          // Individual overclock ring per unit
          const ring = this.add.graphics().setDepth(25);
          ring.lineStyle(2, 0xfbbf24, 0.6);
          ring.strokeCircle(unit.x, unit.y, 5);
          this.tweens.add({
            targets: ring,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 400,
            onComplete: () => ring.destroy(),
          });
        }
        FloatingText.showBigText(this, 'OVERCLOCK!', '#ffdd22');
        // Camera flash
        this.cameras.main.flash(200, 255, 221, 0, false, undefined, this);
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

    // Spawn pop-in animation
    unit.setScale(0.2);
    this.tweens.add({
      targets: unit,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 120,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: unit,
          scaleX: 1,
          scaleY: 1,
          duration: 80,
        });
      },
    });

    // Idle bounce animation (continuous)
    this.addIdleBounce(unit);

    // Deploy effect — flash + particle ring
    const flash = this.add.image(x, y, 'deploy-flash').setDepth(30).setAlpha(0.9);
    this.tweens.add({
      targets: flash,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 350,
      onComplete: () => flash.destroy(),
    });

    // Deploy ring
    const ring = this.add.graphics().setDepth(29);
    ring.lineStyle(3, 0x4ade80, 0.7);
    ring.strokeCircle(x, y, 5);
    this.tweens.add({
      targets: ring,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 400,
      onComplete: () => ring.destroy(),
    });

    // Spawn particles (more, varied)
    for (let i = 0; i < 10; i++) {
      const color = i % 2 === 0 ? 'particle-gold' : 'particle-blue';
      const p = this.add.image(x, y, color).setDepth(30).setScale(0.4 + Math.random() * 0.3);
      const angle = (Math.PI * 2 / 10) * i;
      const dist = 20 + Math.random() * 15;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 10,
        alpha: 0,
        scaleX: 0.05,
        scaleY: 0.05,
        duration: 350 + Math.random() * 200,
        onComplete: () => p.destroy(),
      });
    }

    FloatingText.show(this, x, y - 15, card.name, '#4ade80');

    // Confetti burst (small colored squares flying out)
    const confettiColors = [0xfbbf24, 0x4ade80, 0x60a5fa, 0xf472b6, 0xffffff];
    for (let i = 0; i < 8; i++) {
      const color = confettiColors[i % confettiColors.length];
      const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.3;
      const dist = 25 + Math.random() * 20;
      const confetti = this.add.rectangle(x, y, 4, 3, color, 0.9).setDepth(31);
      confetti.setAngle(Math.random() * 360);
      this.tweens.add({
        targets: confetti,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 15,
        angle: confetti.angle + Phaser.Math.Between(-180, 180),
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 400 + Math.random() * 200,
        onComplete: () => confetti.destroy(),
      });
    }

    // Camera shake
    this.cameras.main.shake(100, 0.004);
  }

  private addIdleBounce(unit: Unit) {
    // Subtle idle bounce — makes units feel alive
    this.tweens.add({
      targets: unit,
      scaleY: { from: 1, to: 1.06 },
      scaleX: { from: 1, to: 0.96 },
      duration: 400 + Math.random() * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
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

    // Enemy spawn pop-in
    unit.setScale(0.2);
    this.tweens.add({
      targets: unit,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 150,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: unit,
          scaleX: 1,
          scaleY: 1,
          duration: 80,
        });
      },
    });

    // Idle bounce
    this.addIdleBounce(unit);

    // Spawn warning particle
    const warn = this.add.circle(x, y, 4, 0xef4444, 0.8).setDepth(28);
    this.tweens.add({
      targets: warn,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => warn.destroy(),
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

    // Camera zoom punch on wave start
    this.cameras.main.shake(200, 0.005);
    this.tweens.add({
      targets: this.cameras.main,
      zoom: 1.03,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });

    // Red flash at enemy spawn zone
    const spawnFlash = this.add.graphics().setDepth(95);
    spawnFlash.fillStyle(0xef4444, 0.15);
    spawnFlash.fillRect(0, 0, GAME_WIDTH, 90);
    this.tweens.add({
      targets: spawnFlash,
      alpha: 0,
      duration: 600,
      onComplete: () => spawnFlash.destroy(),
    });

    FloatingText.showBigText(this, `WAVE ${this.waveSystem.wave}`);

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
    const inZone = pointer.y >= PLAYER_DEPLOY_MIN_Y && pointer.y <= PLAYER_DEPLOY_MAX_Y && pointer.y < 660;

    if (inZone) {
      // Valid deploy zone — pulsing green circle with crosshair
      // Outer glow
      this.deployIndicator.fillStyle(0x4ade80, 0.06);
      this.deployIndicator.fillCircle(pointer.x, pointer.y, 35);
      // Middle ring
      this.deployIndicator.lineStyle(2.5, 0x4ade80, 0.5);
      this.deployIndicator.strokeCircle(pointer.x, pointer.y, 25);
      // Inner ring
      this.deployIndicator.lineStyle(1, 0x4ade80, 0.3);
      this.deployIndicator.strokeCircle(pointer.x, pointer.y, 15);
      // Fill
      this.deployIndicator.fillStyle(0x4ade80, 0.15);
      this.deployIndicator.fillCircle(pointer.x, pointer.y, 25);
      // Crosshair
      this.deployIndicator.lineStyle(1.5, 0x4ade80, 0.4);
      this.deployIndicator.lineBetween(pointer.x - 12, pointer.y, pointer.x - 5, pointer.y);
      this.deployIndicator.lineBetween(pointer.x + 5, pointer.y, pointer.x + 12, pointer.y);
      this.deployIndicator.lineBetween(pointer.x, pointer.y - 12, pointer.x, pointer.y - 5);
      this.deployIndicator.lineBetween(pointer.x, pointer.y + 5, pointer.x, pointer.y + 12);
      // Center dot
      this.deployIndicator.fillStyle(0x4ade80, 0.6);
      this.deployIndicator.fillCircle(pointer.x, pointer.y, 3);
    } else {
      // Invalid zone — red X with circle
      this.deployIndicator.lineStyle(2.5, 0xef4444, 0.5);
      this.deployIndicator.strokeCircle(pointer.x, pointer.y, 20);
      this.deployIndicator.fillStyle(0xef4444, 0.08);
      this.deployIndicator.fillCircle(pointer.x, pointer.y, 20);
      // X marks
      this.deployIndicator.lineStyle(2.5, 0xef4444, 0.6);
      this.deployIndicator.lineBetween(pointer.x - 8, pointer.y - 8, pointer.x + 8, pointer.y + 8);
      this.deployIndicator.lineBetween(pointer.x + 8, pointer.y - 8, pointer.x - 8, pointer.y + 8);
    }
  }

  private towerShootAtEnemies() {
    const enemies = this.enemyUnits.getChildren() as Unit[];
    const activeEnemies = enemies.filter(e => e.active);
    const TOWER_RANGE = 120;
    const TOWER_DPS = 20;

    for (const tower of this.towers) {
      if (tower.isDestroyed()) continue;

      // Find nearest enemy in range
      let nearest: Unit | null = null;
      let nearestDist = TOWER_RANGE;
      for (const enemy of activeEnemies) {
        const dist = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = enemy;
        }
      }

      if (nearest) {
        // Deal damage
        nearest.takeDamage(TOWER_DPS);

        // Projectile visual (bullet from tower to enemy)
        const bullet = this.add.circle(tower.x, tower.y - 20, 3, 0x22c55e, 1).setDepth(35);
        this.tweens.add({
          targets: bullet,
          x: nearest.x,
          y: nearest.y,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            // Impact flash
            const impact = this.add.circle(bullet.x, bullet.y, 5, 0x22c55e, 0.7).setDepth(35);
            this.tweens.add({
              targets: impact,
              scaleX: 2,
              scaleY: 2,
              alpha: 0,
              duration: 150,
              onComplete: () => impact.destroy(),
            });
            bullet.destroy();
          },
        });

        // Muzzle flash on tower (brighter, bigger)
        const muzzle = this.add.circle(tower.x, tower.y - 20, 8, 0xffffff, 0.7).setDepth(34);
        this.tweens.add({
          targets: muzzle,
          scaleX: 2.5,
          scaleY: 2.5,
          alpha: 0,
          duration: 120,
          onComplete: () => muzzle.destroy(),
        });

        // Muzzle smoke puff
        const smoke = this.add.circle(tower.x, tower.y - 22, 4, 0x999999, 0.3).setDepth(33);
        this.tweens.add({
          targets: smoke,
          y: tower.y - 35,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 400,
          onComplete: () => smoke.destroy(),
        });

        // Tower recoil
        const origY = tower.y;
        this.tweens.add({
          targets: tower,
          y: origY + 2,
          duration: 40,
          yoyo: true,
        });

        // Show damage number
        FloatingText.showDamageNumber(this, nearest.x, nearest.y - 10, TOWER_DPS);
      }
    }
  }

  private spawnAmbientParticle() {
    // Cap total game objects to prevent performance issues
    if (this.children.length > 500) return;

    const colors = [0xfbbf24, 0x22c55e, 0x60a5fa, 0xffffff];
    const x = Phaser.Math.Between(10, GAME_WIDTH - 10);
    const y = Phaser.Math.Between(50, 550);
    const color = colors[Phaser.Math.Between(0, colors.length - 1)];

    const p = this.add.circle(x, y, Phaser.Math.Between(1, 2), color, 0.4).setDepth(3);
    this.tweens.add({
      targets: p,
      y: y - 20,
      alpha: 0,
      duration: 1500 + Math.random() * 1000,
      onComplete: () => p.destroy(),
    });
  }

  private blinkTowerLEDs() {
    for (const tower of this.towers) {
      if (tower.isDestroyed()) continue;

      // Green LED blink
      const ledColors = [0x22c55e, 0xfbbf24, 0xef4444];
      const color = ledColors[Phaser.Math.Between(0, ledColors.length - 1)];
      const led = this.add.circle(
        tower.x + Phaser.Math.Between(-15, 15),
        tower.y + Phaser.Math.Between(-20, 10),
        2, color, 0.8,
      ).setDepth(12);

      this.tweens.add({
        targets: led,
        alpha: { from: 0.8, to: 0 },
        scaleX: { from: 1, to: 0.3 },
        scaleY: { from: 1, to: 0.3 },
        duration: 800,
        onComplete: () => led.destroy(),
      });

      // Heat exhaust (rising warm air from top of tower)
      if (tower.hp / tower.maxHp < 0.8 && this.children.length < 500) {
        const heatX = tower.x + Phaser.Math.Between(-10, 10);
        const heatY = tower.y - tower.displayHeight / 2 - 5;
        const heat = this.add.graphics().setDepth(11);
        heat.lineStyle(1, 0xffffff, 0.06);
        // Wavy heat line
        heat.beginPath();
        heat.moveTo(heatX, heatY);
        heat.lineTo(heatX + 3, heatY - 5);
        heat.lineTo(heatX - 2, heatY - 10);
        heat.lineTo(heatX + 2, heatY - 15);
        heat.strokePath();

        this.tweens.add({
          targets: heat,
          y: -10,
          alpha: 0,
          duration: 1000,
          onComplete: () => heat.destroy(),
        });
      }
    }
  }

  private drawTowerRanges() {
    this.towerRangeGraphics.clear();
    const TOWER_RANGE = 120;

    for (const tower of this.towers) {
      if (tower.isDestroyed()) continue;
      // Subtle range circle
      this.towerRangeGraphics.lineStyle(1, 0x22c55e, 0.08);
      this.towerRangeGraphics.strokeCircle(tower.x, tower.y, TOWER_RANGE);
      // Inner ring
      this.towerRangeGraphics.lineStyle(0.5, 0x22c55e, 0.04);
      this.towerRangeGraphics.strokeCircle(tower.x, tower.y, TOWER_RANGE * 0.7);
    }
  }

  private pulseTowerAuras() {
    for (const tower of this.towers) {
      if (tower.isDestroyed()) continue;

      // Expanding green ring (defensive pulse)
      const ring = this.add.graphics().setDepth(6);
      const color = tower.hp / tower.maxHp > 0.5 ? 0x22c55e : 0xfbbf24;
      ring.lineStyle(1.5, color, 0.25);
      ring.strokeCircle(tower.x, tower.y, 15);
      this.tweens.add({
        targets: ring,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 1200,
        ease: 'Sine.easeOut',
        onComplete: () => ring.destroy(),
      });

      // Second delayed ring
      this.time.delayedCall(300, () => {
        const ring2 = this.add.graphics().setDepth(6);
        ring2.lineStyle(1, color, 0.15);
        ring2.strokeCircle(tower.x, tower.y, 12);
        this.tweens.add({
          targets: ring2,
          scaleX: 2.5,
          scaleY: 2.5,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeOut',
          onComplete: () => ring2.destroy(),
        });
      });
    }
  }

  private spawnEnemyTrails() {
    // Cap total game objects
    if (this.children.length > 500) return;

    const enemies = this.enemyUnits.getChildren() as Unit[];
    for (const enemy of enemies) {
      if (!enemy.active) continue;

      // Heat creeps get fire trail
      if (enemy.unitId === 'heat-creep') {
        const p = this.add.circle(
          enemy.x + Phaser.Math.Between(-4, 4),
          enemy.y + Phaser.Math.Between(4, 10),
          Phaser.Math.Between(2, 4),
          Math.random() > 0.5 ? 0xff8c00 : 0xef4444,
          0.6,
        ).setDepth(8);
        this.tweens.add({
          targets: p,
          y: p.y + 8,
          alpha: 0,
          scaleX: 0.2,
          scaleY: 0.2,
          duration: 400 + Math.random() * 200,
          onComplete: () => p.destroy(),
        });
      }
      // Ransomware gets dark smoke
      else if (enemy.unitId === 'ransomware') {
        const p = this.add.circle(
          enemy.x + Phaser.Math.Between(-5, 5),
          enemy.y + Phaser.Math.Between(5, 12),
          Phaser.Math.Between(2, 5),
          0x333333,
          0.35,
        ).setDepth(8);
        this.tweens.add({
          targets: p,
          y: p.y + 10,
          x: p.x + Phaser.Math.Between(-3, 3),
          alpha: 0,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 500 + Math.random() * 300,
          onComplete: () => p.destroy(),
        });
      }
      // Zero-day gets electric sparks
      else if (enemy.unitId === 'zero-day') {
        if (Math.random() < 0.5) {
          const p = this.add.circle(
            enemy.x + Phaser.Math.Between(-8, 8),
            enemy.y + Phaser.Math.Between(-8, 8),
            1.5,
            0xfbbf24,
            0.8,
          ).setDepth(8);
          this.tweens.add({
            targets: p,
            alpha: 0,
            duration: 200,
            onComplete: () => p.destroy(),
          });
        }
      }
      // Cryptominer gets purple sparkle
      else if (enemy.unitId === 'cryptominer') {
        if (Math.random() < 0.4) {
          const p = this.add.circle(
            enemy.x + Phaser.Math.Between(-6, 6),
            enemy.y + Phaser.Math.Between(-6, 6),
            1.5,
            0x8b5cf6,
            0.7,
          ).setDepth(8);
          this.tweens.add({
            targets: p,
            y: p.y - 8,
            alpha: 0,
            duration: 300,
            onComplete: () => p.destroy(),
          });
        }
      }
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
