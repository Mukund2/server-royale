import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create() {
    this.generateTextures();
    this.scene.start('MenuScene');
  }

  private generateTextures() {
    this.generatePlayerUnits();
    this.generateEnemyUnits();
    this.generateTowers();
    this.generateCards();
    this.generateProjectiles();
    this.generateArena();
  }

  // ── Player Units (warm, friendly, Supercell-style) ──
  private generatePlayerUnits() {
    // Junior Tech — green guy with hard hat
    this.createDetailedUnit('junior-tech', 28, (g, s) => {
      // Body
      g.fillStyle(0x4ade80);
      g.fillCircle(s/2, s/2 + 2, s/2 - 4);
      // Hard hat
      g.fillStyle(0xfbbf24);
      g.fillRoundedRect(s/2 - 8, 1, 16, 8, 3);
      g.fillRect(s/2 - 10, 7, 20, 3);
      // Eyes
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 4, s/2, 4);
      g.fillCircle(s/2 + 4, s/2, 4);
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 3, s/2, 2);
      g.fillCircle(s/2 + 5, s/2, 2);
      // Mouth
      g.fillStyle(0x166534);
      g.fillRoundedRect(s/2 - 3, s/2 + 6, 6, 3, 1);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeCircle(s/2, s/2 + 2, s/2 - 4);
    });

    // Senior Engineer — blue tanky square with glasses
    this.createDetailedUnit('senior-engineer', 32, (g, s) => {
      g.fillStyle(0x3b82f6);
      g.fillRoundedRect(3, 3, s - 6, s - 6, 5);
      // Tie
      g.fillStyle(0xef4444);
      g.fillTriangle(s/2, 14, s/2 - 3, 20, s/2 + 3, 20);
      g.fillRect(s/2 - 1, 20, 2, 8);
      // Glasses
      g.lineStyle(2, 0x1e3a5f);
      g.strokeCircle(s/2 - 5, s/2 - 3, 4);
      g.strokeCircle(s/2 + 5, s/2 - 3, 4);
      g.lineBetween(s/2 - 1, s/2 - 3, s/2 + 1, s/2 - 3);
      // Eyes behind glasses
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 5, s/2 - 3, 3);
      g.fillCircle(s/2 + 5, s/2 - 3, 3);
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 4, s/2 - 3, 1.5);
      g.fillCircle(s/2 + 6, s/2 - 3, 1.5);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeRoundedRect(3, 3, s - 6, s - 6, 5);
    });

    // AI Bot — orange/gold with antenna
    this.createDetailedUnit('ai-bot', 30, (g, s) => {
      // Antenna
      g.lineStyle(2, 0x666666);
      g.lineBetween(s/2, 0, s/2, 6);
      g.fillStyle(0xff0000);
      g.fillCircle(s/2, 2, 3);
      // Head
      g.fillStyle(0xf97316);
      g.fillRoundedRect(4, 6, s - 8, s - 10, 4);
      // Screen face
      g.fillStyle(0x0a0a1a);
      g.fillRoundedRect(8, 10, s - 16, s/2 - 6, 3);
      // LED eyes
      g.fillStyle(0x22ff88);
      g.fillRect(s/2 - 5, 14, 3, 3);
      g.fillRect(s/2 + 3, 14, 3, 3);
      // Mouth line
      g.lineStyle(1, 0x22ff88);
      g.lineBetween(s/2 - 4, 20, s/2 + 4, 20);
      // Body bolts
      g.fillStyle(0x888888);
      g.fillCircle(8, s - 8, 2);
      g.fillCircle(s - 8, s - 8, 2);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeRoundedRect(4, 6, s - 8, s - 10, 4);
    });

    // Firewall — thick wall with glowing runes
    this.createDetailedUnit('firewall', 40, (g, s) => {
      const h = 20;
      const y0 = (s - h) / 2;
      // Wall body
      g.fillStyle(0x64748b);
      g.fillRoundedRect(2, y0, s - 4, h, 3);
      // Bricks
      g.lineStyle(1, 0x475569);
      g.lineBetween(2, y0 + h/2, s - 2, y0 + h/2);
      for (let i = 1; i < 4; i++) {
        const xOff = (i % 2 === 0) ? 5 : 0;
        g.lineBetween(xOff + i * (s-4)/4, y0, xOff + i * (s-4)/4, y0 + h/2);
      }
      // Glow runes
      g.fillStyle(0x38bdf8, 0.7);
      g.fillCircle(10, s/2, 2);
      g.fillCircle(20, s/2, 2);
      g.fillCircle(30, s/2, 2);
      // Shield icon center
      g.lineStyle(1.5, 0x38bdf8, 0.9);
      g.strokeCircle(s/2, s/2, 5);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeRoundedRect(2, y0, s - 4, h, 3);
    }, 40, 40);

    // Cooling System — spinning cyan fan
    this.createDetailedUnit('cooling-system', 30, (g, s) => {
      // Base plate
      g.fillStyle(0x334155);
      g.fillCircle(s/2, s/2, s/2 - 2);
      // Fan center
      g.fillStyle(0x0ea5e9);
      g.fillCircle(s/2, s/2, 4);
      // Fan blades
      g.fillStyle(0x22d3ee, 0.8);
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const x1 = s/2 + Math.cos(angle) * 4;
        const y1 = s/2 + Math.sin(angle) * 4;
        const x2 = s/2 + Math.cos(angle + 0.6) * 12;
        const y2 = s/2 + Math.sin(angle + 0.6) * 12;
        const x3 = s/2 + Math.cos(angle - 0.2) * 12;
        const y3 = s/2 + Math.sin(angle - 0.2) * 12;
        g.fillTriangle(x1, y1, x2, y2, x3, y3);
      }
      // Frost particles
      g.fillStyle(0xbae6fd, 0.6);
      g.fillCircle(s/2 - 8, s/2 - 8, 2);
      g.fillCircle(s/2 + 9, s/2 - 6, 1.5);
      g.fillCircle(s/2 - 6, s/2 + 9, 1.5);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeCircle(s/2, s/2, s/2 - 2);
    });
  }

  // ── Enemy Units (menacing, hot, Clash Royale villain style) ──
  private generateEnemyUnits() {
    // Heat Creep — fiery red blob with angry eyes
    this.createDetailedUnit('heat-creep', 28, (g, s) => {
      // Fire aura
      g.fillStyle(0xff6b00, 0.3);
      g.fillCircle(s/2, s/2, s/2);
      // Body
      g.fillStyle(0xef4444);
      g.fillCircle(s/2, s/2 + 1, s/2 - 4);
      // Flame top
      g.fillStyle(0xff8c00);
      g.fillTriangle(s/2, 1, s/2 - 5, 8, s/2 + 5, 8);
      g.fillTriangle(s/2 - 4, 3, s/2 - 8, 10, s/2, 10);
      g.fillTriangle(s/2 + 4, 3, s/2, 10, s/2 + 8, 10);
      // Angry eyes
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 4, s/2, 4);
      g.fillCircle(s/2 + 4, s/2, 4);
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 3, s/2 + 1, 2);
      g.fillCircle(s/2 + 5, s/2 + 1, 2);
      // Angry brows
      g.lineStyle(2, 0x7f1d1d);
      g.lineBetween(s/2 - 8, s/2 - 5, s/2 - 1, s/2 - 3);
      g.lineBetween(s/2 + 8, s/2 - 5, s/2 + 1, s/2 - 3);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeCircle(s/2, s/2 + 1, s/2 - 4);
    });

    // DDoS mini — tiny pink skull
    this.createDetailedUnit('ddos-mini', 16, (g, s) => {
      g.fillStyle(0xf472b6);
      g.fillCircle(s/2, s/2, s/2 - 1);
      // Eyes (X marks)
      g.lineStyle(1.5, 0x1a1a2e);
      g.lineBetween(s/2 - 4, s/2 - 2, s/2 - 1, s/2 + 1);
      g.lineBetween(s/2 - 1, s/2 - 2, s/2 - 4, s/2 + 1);
      g.lineBetween(s/2 + 1, s/2 - 2, s/2 + 4, s/2 + 1);
      g.lineBetween(s/2 + 4, s/2 - 2, s/2 + 1, s/2 + 1);
      // Outline
      g.lineStyle(2, 0x000000, 0.9);
      g.strokeCircle(s/2, s/2, s/2 - 1);
    });

    // Ransomware — big dark menacing lock
    this.createDetailedUnit('ransomware', 36, (g, s) => {
      // Body
      g.fillStyle(0x7f1d1d);
      g.fillRoundedRect(4, s/3, s - 8, s * 2/3 - 4, 5);
      // Lock shackle
      g.lineStyle(4, 0x991b1b);
      g.beginPath();
      g.arc(s/2, s/3, 8, Math.PI, 0, false);
      g.strokePath();
      // Keyhole
      g.fillStyle(0xfbbf24);
      g.fillCircle(s/2, s/2 + 4, 4);
      g.fillRect(s/2 - 1.5, s/2 + 6, 3, 6);
      // Skull decoration
      g.fillStyle(0xef4444, 0.6);
      g.fillCircle(s/2 - 8, s/3 + 8, 2);
      g.fillCircle(s/2 + 8, s/3 + 8, 2);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokeRoundedRect(4, s/3, s - 8, s * 2/3 - 4, 5);
    });

    // Zero-Day — fast yellow lightning bolt shape
    this.createDetailedUnit('zero-day', 26, (g, s) => {
      // Glow
      g.fillStyle(0xfbbf24, 0.2);
      g.fillCircle(s/2, s/2, s/2);
      // Lightning body
      g.fillStyle(0xfbbf24);
      const pts = [
        s/2 + 2, 0,
        s/2 - 6, s/2,
        s/2 - 1, s/2,
        s/2 - 4, s,
        s/2 + 6, s/2 + 2,
        s/2 + 1, s/2 + 2,
      ];
      g.fillPoints(this.toPoints(pts), true);
      // Electric sparks
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 4, s/4, 1.5);
      g.fillCircle(s/2 + 5, s * 3/4, 1.5);
      // Outline
      g.lineStyle(2, 0x000000, 0.9);
      g.strokePoints(this.toPoints(pts), true);
    });

    // Cryptominer — purple crystal/gem that drains resources
    this.createDetailedUnit('cryptominer', 30, (g, s) => {
      // Gem body
      g.fillStyle(0x8b5cf6);
      const gemPts = [
        s/2, 2,
        s - 4, s/3,
        s - 2, s * 2/3,
        s/2, s - 2,
        2, s * 2/3,
        4, s/3,
      ];
      g.fillPoints(this.toPoints(gemPts), true);
      // Inner facets
      g.fillStyle(0xa78bfa, 0.5);
      g.fillTriangle(s/2, 6, s/2 + 8, s/2, s/2, s/2);
      g.fillStyle(0x7c3aed, 0.5);
      g.fillTriangle(s/2, 6, s/2, s/2, s/2 - 8, s/2);
      // Sparkle
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 3, s/3, 2);
      // Bitcoin symbol
      g.lineStyle(1.5, 0xfbbf24);
      g.lineBetween(s/2, s/2 + 2, s/2, s/2 + 8);
      g.strokeCircle(s/2, s/2 + 5, 4);
      // Outline
      g.lineStyle(2.5, 0x000000, 0.9);
      g.strokePoints(this.toPoints(gemPts), true);
    });
  }

  // ── Towers ──
  private generateTowers() {
    // Server Rack (lane tower)
    {
      const w = 48, h = 58;
      const g = this.add.graphics();
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(4, 6, w, h, 6);
      // Main body
      const grad = 0x475569;
      g.fillStyle(grad);
      g.fillRoundedRect(2, 2, w, h, 6);
      // Front panel lighter
      g.fillStyle(0x64748b);
      g.fillRoundedRect(6, 6, w - 8, h - 8, 4);
      // Server slots
      for (let i = 0; i < 4; i++) {
        const slotY = 10 + i * 12;
        g.fillStyle(0x334155);
        g.fillRoundedRect(9, slotY, w - 14, 9, 2);
        // Status lights
        g.fillStyle(0x22c55e);
        g.fillCircle(14, slotY + 4.5, 2);
        g.fillStyle(0x22c55e, 0.5);
        g.fillCircle(20, slotY + 4.5, 2);
        // Drive bays
        g.fillStyle(0x1e293b);
        g.fillRect(26, slotY + 1, 12, 7);
        g.lineStyle(0.5, 0x475569);
        g.lineBetween(30, slotY + 1, 30, slotY + 8);
        g.lineBetween(34, slotY + 1, 34, slotY + 8);
      }
      // Top vent
      g.lineStyle(1, 0x334155);
      for (let x = 10; x < w - 6; x += 4) {
        g.lineBetween(x, 4, x + 2, 4);
      }
      // Outline
      g.lineStyle(3, 0x000000, 0.9);
      g.strokeRoundedRect(2, 2, w, h, 6);
      g.generateTexture('server-rack', w + 6, h + 8);
      g.destroy();
    }

    // Main Server (king tower - bigger, golden)
    {
      const w = 70, h = 64;
      const g = this.add.graphics();
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(4, 6, w, h, 8);
      // Main body
      g.fillStyle(0x78716c);
      g.fillRoundedRect(2, 2, w, h, 8);
      // Gold trim
      g.fillStyle(0xfbbf24);
      g.fillRoundedRect(2, 2, w, 6, { tl: 8, tr: 8, bl: 0, br: 0 });
      g.fillRoundedRect(2, h - 4, w, 4, { tl: 0, tr: 0, bl: 8, br: 8 });
      // Front panel
      g.fillStyle(0x57534e);
      g.fillRoundedRect(8, 12, w - 12, h - 18, 4);
      // Big server slots
      for (let i = 0; i < 3; i++) {
        const slotY = 16 + i * 14;
        g.fillStyle(0x292524);
        g.fillRoundedRect(12, slotY, w - 20, 11, 2);
        // Lights
        g.fillStyle(0xef4444);
        g.fillCircle(18, slotY + 5.5, 2.5);
        g.fillStyle(0xfbbf24);
        g.fillCircle(24, slotY + 5.5, 2.5);
        g.fillStyle(0x22c55e);
        g.fillCircle(30, slotY + 5.5, 2.5);
      }
      // Crown/star emblem (manual diamond)
      g.fillStyle(0xfbbf24);
      const cx = w/2 + 1, cy = h - 12, sr = 6;
      g.fillTriangle(cx, cy - sr, cx - sr, cy, cx + sr, cy);
      g.fillTriangle(cx, cy + sr, cx - sr, cy, cx + sr, cy);
      // Outline
      g.lineStyle(3, 0x000000, 0.9);
      g.strokeRoundedRect(2, 2, w, h, 8);
      g.generateTexture('main-server', w + 6, h + 8);
      g.destroy();
    }
  }

  // ── Cards ──
  private generateCards() {
    const w = 72, h = 95;
    const g = this.add.graphics();
    // Card shadow
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(3, 4, w, h, 10);
    // Card body - warm parchment
    g.fillStyle(0x2d2a4a);
    g.fillRoundedRect(0, 0, w, h, 10);
    // Inner area
    g.fillStyle(0x3d3a5a);
    g.fillRoundedRect(4, 4, w - 8, h - 8, 8);
    // Gold border
    g.lineStyle(2.5, 0xfbbf24, 0.8);
    g.strokeRoundedRect(1, 1, w - 2, h - 2, 10);
    // Inner border
    g.lineStyle(1, 0x8b7355, 0.4);
    g.strokeRoundedRect(4, 4, w - 8, h - 8, 8);
    g.generateTexture('card-bg', w + 4, h + 5);
    g.destroy();
  }

  // ── Projectiles & Effects ──
  private generateProjectiles() {
    // Bullet
    this.createGlow('bullet', 6, 0xffffff, 1);
    // Area effect
    this.createGlow('area-effect', 80, 0x22d3ee, 0.2);
    // Heal effect
    this.createGlow('heal-effect', 60, 0x22c55e, 0.25);
    // Power surge
    this.createGlow('power-surge', 100, 0xff8c00, 0.3);
    // Deploy flash
    this.createGlow('deploy-flash', 40, 0xfbbf24, 0.4);
    // Particle
    this.createGlow('particle', 8, 0xffffff, 0.8);
    this.createGlow('particle-red', 8, 0xff4444, 0.8);
    this.createGlow('particle-gold', 8, 0xfbbf24, 0.8);
    this.createGlow('particle-blue', 8, 0x3b82f6, 0.8);
  }

  // ── Arena ──
  private generateArena() {
    const g = this.add.graphics();
    const W = GAME_WIDTH, H = GAME_HEIGHT;

    // -- Base grass with rich variation --
    g.fillStyle(0x4a7c59);
    g.fillRect(0, 0, W, H);

    // Alternating grass stripes (Clash Royale style)
    for (let y = 0; y < H; y += 16) {
      const stripe = y % 32 === 0;
      g.fillStyle(stripe ? 0x558c65 : 0x477856);
      g.fillRect(0, y, W, 16);
    }

    // Subtle grass texture dots
    const grassColors = [0x5a9068, 0x3d6b4a, 0x6aa07a, 0x4f8a60];
    for (let i = 0; i < 200; i++) {
      const gx = ((i * 37 + 13) % W);
      const gy = ((i * 53 + 7) % (H - 100));
      g.fillStyle(grassColors[i % grassColors.length], 0.3);
      g.fillCircle(gx, gy, 1 + (i % 2));
    }

    // Small flowers scattered in grass
    const flowerColors = [0xf9e547, 0xffffff, 0xf472b6, 0x93c5fd];
    for (let i = 0; i < 25; i++) {
      const fx = ((i * 71 + 29) % (W - 40)) + 20;
      const fy = ((i * 43 + 17) % (H - 200)) + 20;
      // Skip river zone and HUD
      if (fy > 260 && fy < 330) continue;
      if (fy > H - 100) continue;
      g.fillStyle(flowerColors[i % flowerColors.length], 0.6);
      g.fillCircle(fx, fy, 2);
      g.fillStyle(0x3d6b4a, 0.5);
      g.fillCircle(fx, fy + 3, 1);
    }

    // -- Cobblestone lane paths --
    const laneXPositions = [W / 4, W * 3 / 4];
    const pathW = 50;
    for (const laneX of laneXPositions) {
      // Path base
      g.fillStyle(0x9e8b73, 0.4);
      g.fillRect(laneX - pathW / 2, 0, pathW, H - 100);
      // Cobblestones
      for (let py = 4; py < H - 100; py += 12) {
        for (let px = 0; px < pathW - 8; px += 14) {
          const stoneX = laneX - pathW / 2 + px + 4 + ((py / 12) % 2 === 0 ? 0 : 7);
          const stoneW = 10 + ((px + py) % 4);
          const stoneH = 8 + ((px * py) % 3);
          const shade = ((px + py) % 3 === 0) ? 0xb8a890 : ((px + py) % 3 === 1) ? 0xa89880 : 0xc8b8a0;
          g.fillStyle(shade, 0.5);
          g.fillRoundedRect(stoneX, py, stoneW, stoneH, 2);
          g.lineStyle(0.5, 0x6b5c45, 0.3);
          g.strokeRoundedRect(stoneX, py, stoneW, stoneH, 2);
        }
      }
    }

    // -- Decorative bushes at arena edges --
    const bushPositions = [
      { x: 12, y: 100 }, { x: W - 12, y: 100 },
      { x: 12, y: 200 }, { x: W - 12, y: 200 },
      { x: 12, y: 400 }, { x: W - 12, y: 400 },
      { x: 12, y: 500 }, { x: W - 12, y: 500 },
    ];
    for (const bp of bushPositions) {
      // Bush shadow
      g.fillStyle(0x2d5a3d, 0.3);
      g.fillEllipse(bp.x, bp.y + 3, 20, 10);
      // Bush body
      g.fillStyle(0x3d8b55, 0.7);
      g.fillCircle(bp.x, bp.y, 8);
      g.fillCircle(bp.x - 5, bp.y + 2, 6);
      g.fillCircle(bp.x + 5, bp.y + 2, 6);
      // Bush highlight
      g.fillStyle(0x5aad6e, 0.4);
      g.fillCircle(bp.x - 2, bp.y - 3, 4);
    }

    // -- Small rocks scattered --
    const rockPositions = [
      { x: 30, y: 150 }, { x: W - 35, y: 155 },
      { x: 25, y: 350 }, { x: W - 25, y: 345 },
      { x: 35, y: 550 }, { x: W - 30, y: 545 },
    ];
    for (const rp of rockPositions) {
      g.fillStyle(0x78716c, 0.5);
      g.fillEllipse(rp.x, rp.y, 8, 5);
      g.fillStyle(0x9e9890, 0.3);
      g.fillEllipse(rp.x - 1, rp.y - 1, 5, 3);
    }

    // -- River (wider, more detailed) --
    const riverY = 275;
    const riverH = 38;

    // River bed (dark underneath)
    g.fillStyle(0x1e3a5f, 0.8);
    g.fillRect(0, riverY + 2, W, riverH);

    // Main water body
    g.fillStyle(0x2563eb, 0.75);
    g.fillRect(0, riverY, W, riverH);

    // Water surface layers
    g.fillStyle(0x3b82f6, 0.5);
    g.fillRect(0, riverY, W, riverH / 2);

    // Water shimmer waves
    for (let x = 0; x < W; x += 20) {
      g.fillStyle(0x60a5fa, 0.35);
      g.fillEllipse(x + 10, riverY + riverH * 0.35, 16, 5);
      g.fillStyle(0x93c5fd, 0.2);
      g.fillEllipse(x + 5, riverY + riverH * 0.65, 14, 4);
    }

    // Sparkle highlights on water
    for (let i = 0; i < 12; i++) {
      const sx = ((i * 37 + 11) % W);
      const sy = riverY + 5 + ((i * 13) % (riverH - 10));
      g.fillStyle(0xffffff, 0.25);
      g.fillCircle(sx, sy, 1.5);
    }

    // River banks (earthy brown with stone edge)
    g.fillStyle(0x6b5c45);
    g.fillRect(0, riverY - 4, W, 4);
    g.fillRect(0, riverY + riverH, W, 4);
    g.fillStyle(0x8b7a62, 0.6);
    g.fillRect(0, riverY - 2, W, 2);
    g.fillRect(0, riverY + riverH + 2, W, 2);

    // -- Bridges (two, one per lane) --
    const bridgeW = 64;
    for (const laneX of laneXPositions) {
      // Bridge shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRect(laneX - bridgeW / 2 + 2, riverY - 6, bridgeW, riverH + 16);

      // Bridge planks
      g.fillStyle(0xb89f7e);
      g.fillRect(laneX - bridgeW / 2, riverY - 6, bridgeW, riverH + 12);

      // Plank lines
      g.lineStyle(1, 0x8b7355, 0.6);
      for (let by = riverY - 4; by < riverY + riverH + 4; by += 6) {
        g.lineBetween(laneX - bridgeW / 2 + 2, by, laneX + bridgeW / 2 - 2, by);
      }

      // Bridge stone edges
      g.fillStyle(0x78716c);
      g.fillRect(laneX - bridgeW / 2, riverY - 8, bridgeW, 4);
      g.fillRect(laneX - bridgeW / 2, riverY + riverH + 4, bridgeW, 4);

      // Bridge rails (stone pillars)
      g.fillStyle(0x6b6560);
      g.fillRoundedRect(laneX - bridgeW / 2 - 3, riverY - 10, 6, riverH + 22, 2);
      g.fillRoundedRect(laneX + bridgeW / 2 - 3, riverY - 10, 6, riverH + 22, 2);
      // Rail caps
      g.fillStyle(0x9e9890);
      g.fillRoundedRect(laneX - bridgeW / 2 - 4, riverY - 12, 8, 4, 2);
      g.fillRoundedRect(laneX + bridgeW / 2 - 4, riverY - 12, 8, 4, 2);
    }

    // -- Lane divider (center fence/hedge) --
    g.lineStyle(2, 0x3d6b4a, 0.4);
    for (let y = 0; y < H - 120; y += 10) {
      // Skip river zone
      if (y > riverY - 10 && y < riverY + riverH + 10) continue;
      g.lineBetween(W / 2, y, W / 2, y + 5);
    }
    // Fence posts
    for (let y = 10; y < H - 120; y += 40) {
      if (y > riverY - 10 && y < riverY + riverH + 10) continue;
      g.fillStyle(0x6b5c45, 0.5);
      g.fillRoundedRect(W / 2 - 2, y, 4, 8, 1);
    }

    // -- Enemy spawn zone (dark, menacing with red glow) --
    g.fillStyle(0x1a0a1e, 0.6);
    g.fillRect(0, 0, W, 85);
    // Gradient fade
    g.fillStyle(0x1a0a1e, 0.3);
    g.fillRect(0, 85, W, 20);
    // Red danger stripes
    g.lineStyle(2, 0xef4444, 0.12);
    for (let x = -80; x < W + 80; x += 18) {
      g.lineBetween(x, 0, x + 85, 85);
    }
    // Skull/danger markers
    for (let x = 40; x < W; x += 90) {
      g.fillStyle(0xef4444, 0.15);
      g.fillCircle(x, 30, 6);
      g.lineStyle(1, 0xef4444, 0.2);
      g.strokeCircle(x, 30, 8);
    }

    // -- Player deploy zone (subtle green tint) --
    g.fillStyle(0x22c55e, 0.06);
    g.fillRect(0, 350, W, 220);
    // Deploy zone border
    g.lineStyle(1, 0x22c55e, 0.1);
    g.lineBetween(0, 350, W, 350);
    g.lineBetween(0, 570, W, 570);

    // -- Tower platforms (stone platforms with gold trim) --
    // Lane tower platforms
    for (const laneX of laneXPositions) {
      // Platform shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(laneX, 598, 62, 22);
      // Stone platform
      g.fillStyle(0x8b8580);
      g.fillEllipse(laneX, 595, 58, 20);
      // Platform top
      g.fillStyle(0xa09a94);
      g.fillEllipse(laneX, 593, 52, 16);
      // Gold ring
      g.lineStyle(1.5, 0xfbbf24, 0.3);
      g.strokeEllipse(laneX, 595, 58, 20);
    }

    // Main server platform (larger, golden)
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(W / 2, 658, 88, 28);
    g.fillStyle(0x8b8580);
    g.fillEllipse(W / 2, 655, 84, 26);
    g.fillStyle(0xa09a94);
    g.fillEllipse(W / 2, 653, 76, 22);
    // Gold accents
    g.fillStyle(0xfbbf24, 0.15);
    g.fillEllipse(W / 2, 653, 68, 18);
    g.lineStyle(2, 0xfbbf24, 0.4);
    g.strokeEllipse(W / 2, 655, 84, 26);

    // -- Decorative torches near tower platforms --
    const torchPositions = [
      { x: W / 4 - 35, y: 580 }, { x: W / 4 + 35, y: 580 },
      { x: W * 3 / 4 - 35, y: 580 }, { x: W * 3 / 4 + 35, y: 580 },
      { x: W / 2 - 50, y: 640 }, { x: W / 2 + 50, y: 640 },
    ];
    for (const tp of torchPositions) {
      // Torch pole
      g.fillStyle(0x6b5c45);
      g.fillRect(tp.x - 1, tp.y, 3, 12);
      // Flame glow
      g.fillStyle(0xfbbf24, 0.15);
      g.fillCircle(tp.x, tp.y - 2, 8);
      // Flame
      g.fillStyle(0xff8c00, 0.7);
      g.fillTriangle(tp.x, tp.y - 7, tp.x - 3, tp.y, tp.x + 3, tp.y);
      g.fillStyle(0xfbbf24, 0.6);
      g.fillTriangle(tp.x, tp.y - 5, tp.x - 2, tp.y - 1, tp.x + 2, tp.y - 1);
    }

    // -- Bottom HUD area (dark panel) --
    g.fillStyle(0x1a1736);
    g.fillRect(0, H - 100, W, 100);
    // Panel gradient top
    g.fillStyle(0x231f42, 0.8);
    g.fillRect(0, H - 100, W, 8);
    // Gold trim on HUD
    g.fillStyle(0xfbbf24, 0.35);
    g.fillRect(0, H - 100, W, 2);
    // Inner gold line
    g.fillStyle(0xfbbf24, 0.15);
    g.fillRect(0, H - 98, W, 1);

    // -- Edge vignette (corners darker) --
    g.fillStyle(0x1a1a2e, 0.2);
    g.fillCircle(0, 0, 50);
    g.fillCircle(W, 0, 50);
    g.fillCircle(0, H - 100, 40);
    g.fillCircle(W, H - 100, 40);

    g.generateTexture('arena-bg', W, H);
    g.destroy();
  }

  // ── Helpers ──
  private createDetailedUnit(
    key: string,
    size: number,
    draw: (g: Phaser.GameObjects.Graphics, s: number) => void,
    texW?: number,
    texH?: number
  ) {
    const g = this.add.graphics();
    draw(g, size);
    g.generateTexture(key, texW || size, texH || size);
    g.destroy();
  }

  private createGlow(key: string, size: number, color: number, alpha: number) {
    const g = this.add.graphics();
    // Outer glow
    g.fillStyle(color, alpha * 0.3);
    g.fillCircle(size / 2, size / 2, size / 2);
    // Inner bright
    g.fillStyle(color, alpha);
    g.fillCircle(size / 2, size / 2, size / 3);
    // Core
    g.fillStyle(0xffffff, alpha * 0.5);
    g.fillCircle(size / 2, size / 2, size / 6);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  private toPoints(coords: number[]): Phaser.Geom.Point[] {
    const pts: Phaser.Geom.Point[] = [];
    for (let i = 0; i < coords.length; i += 2) {
      pts.push(new Phaser.Geom.Point(coords[i], coords[i + 1]));
    }
    return pts;
  }
}
