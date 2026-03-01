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

  // ── Player Units (warm, friendly, Supercell-style — BIGGER, bouncier) ──
  private generatePlayerUnits() {
    // Junior Tech — green guy with hard hat (bigger, cuter)
    this.createDetailedUnit('junior-tech', 38, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(s/2, s - 4, s/2 + 2, 6);
      // Body (round, chubby)
      g.fillStyle(0x4ade80);
      g.fillCircle(s/2, s/2 + 3, s/2 - 5);
      // Body highlight
      g.fillStyle(0x6ee7a0, 0.5);
      g.fillCircle(s/2 - 3, s/2 - 2, s/3);
      // Hard hat
      g.fillStyle(0xfbbf24);
      g.fillRoundedRect(s/2 - 11, 1, 22, 10, 4);
      g.fillRect(s/2 - 13, 9, 26, 4);
      // Hat highlight
      g.fillStyle(0xfcd34d, 0.6);
      g.fillRoundedRect(s/2 - 8, 3, 12, 5, 2);
      // Big eyes (Supercell style)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 6, s/2 - 1, 6);
      g.fillCircle(s/2 + 6, s/2 - 1, 6);
      // Pupils (looking right)
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 4, s/2 - 1, 3);
      g.fillCircle(s/2 + 8, s/2 - 1, 3);
      // Eye shine
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 5, s/2 - 3, 1.5);
      g.fillCircle(s/2 + 7, s/2 - 3, 1.5);
      // Happy mouth
      g.lineStyle(2, 0x166534);
      g.beginPath();
      g.arc(s/2, s/2 + 5, 5, 0.2, Math.PI - 0.2, false);
      g.strokePath();
      // Wrench in hand
      g.fillStyle(0x94a3b8);
      g.fillRect(s - 8, s/2 + 2, 3, 10);
      g.fillCircle(s - 6, s/2 + 2, 3);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeCircle(s/2, s/2 + 3, s/2 - 5);
    });

    // Senior Engineer — blue tanky guy with glasses (bigger)
    this.createDetailedUnit('senior-engineer', 42, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(s/2, s - 3, s/2, 6);
      // Body (square-ish, tanky)
      g.fillStyle(0x3b82f6);
      g.fillRoundedRect(4, 4, s - 8, s - 8, 7);
      // Body highlight
      g.fillStyle(0x60a5fa, 0.4);
      g.fillRoundedRect(6, 6, s/2, s/2, 5);
      // Tie
      g.fillStyle(0xef4444);
      g.fillTriangle(s/2, 16, s/2 - 4, 24, s/2 + 4, 24);
      g.fillRect(s/2 - 2, 24, 4, 10);
      // Glasses (thick frames)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 7, s/2 - 4, 5);
      g.fillCircle(s/2 + 7, s/2 - 4, 5);
      g.lineStyle(2.5, 0x1e3a5f);
      g.strokeCircle(s/2 - 7, s/2 - 4, 5);
      g.strokeCircle(s/2 + 7, s/2 - 4, 5);
      g.lineBetween(s/2 - 2, s/2 - 4, s/2 + 2, s/2 - 4);
      // Pupils
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 6, s/2 - 4, 2);
      g.fillCircle(s/2 + 8, s/2 - 4, 2);
      // Eye shine
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 7, s/2 - 6, 1.5);
      g.fillCircle(s/2 + 7, s/2 - 6, 1.5);
      // Stern mouth
      g.lineStyle(2, 0x1e3a8a);
      g.lineBetween(s/2 - 4, s/2 + 6, s/2 + 4, s/2 + 6);
      // Coffee mug
      g.fillStyle(0xffffff);
      g.fillRoundedRect(s - 12, s/2, 7, 9, 2);
      g.lineStyle(1.5, 0x1e3a5f);
      g.strokeRoundedRect(s - 12, s/2, 7, 9, 2);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeRoundedRect(4, 4, s - 8, s - 8, 7);
    });

    // AI Bot — orange/gold robot with antenna (bigger)
    this.createDetailedUnit('ai-bot', 40, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(s/2, s - 3, s/2 - 2, 6);
      // Antenna
      g.lineStyle(2.5, 0x888888);
      g.lineBetween(s/2, 0, s/2, 8);
      g.fillStyle(0xff0000);
      g.fillCircle(s/2, 2, 4);
      g.fillStyle(0xff6666, 0.5);
      g.fillCircle(s/2 - 1, 1, 2);
      // Head body
      g.fillStyle(0xf97316);
      g.fillRoundedRect(5, 8, s - 10, s - 14, 6);
      // Body highlight
      g.fillStyle(0xfb923c, 0.4);
      g.fillRoundedRect(7, 10, s/2 - 4, s/2 - 4, 4);
      // Screen face
      g.fillStyle(0x0a0a1a);
      g.fillRoundedRect(10, 13, s - 20, s/2 - 6, 4);
      // Screen glow
      g.fillStyle(0x22ff88, 0.1);
      g.fillRoundedRect(11, 14, s - 22, s/2 - 8, 3);
      // LED eyes (bigger, glowing)
      g.fillStyle(0x22ff88);
      g.fillRoundedRect(s/2 - 8, 17, 5, 5, 1);
      g.fillRoundedRect(s/2 + 3, 17, 5, 5, 1);
      // Eye glow
      g.fillStyle(0x22ff88, 0.3);
      g.fillCircle(s/2 - 5, 19, 5);
      g.fillCircle(s/2 + 5, 19, 5);
      // Mouth (digital smile)
      g.lineStyle(1.5, 0x22ff88);
      g.lineBetween(s/2 - 6, 26, s/2 - 3, 26);
      g.lineBetween(s/2 - 3, 26, s/2 - 3, 28);
      g.lineBetween(s/2 - 3, 28, s/2 + 3, 28);
      g.lineBetween(s/2 + 3, 28, s/2 + 3, 26);
      g.lineBetween(s/2 + 3, 26, s/2 + 6, 26);
      // Body bolts
      g.fillStyle(0xaaaaaa);
      g.fillCircle(10, s - 10, 3);
      g.fillCircle(s - 10, s - 10, 3);
      g.fillStyle(0x888888);
      g.fillCircle(10, s - 10, 1.5);
      g.fillCircle(s - 10, s - 10, 1.5);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeRoundedRect(5, 8, s - 10, s - 14, 6);
    });

    // Firewall — thick wall with glowing runes (wider, more imposing)
    this.createDetailedUnit('firewall', 50, (g, s) => {
      const h = 28;
      const y0 = (s - h) / 2;
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(4, y0 + 4, s - 4, h, 4);
      // Wall body
      g.fillStyle(0x64748b);
      g.fillRoundedRect(2, y0, s - 4, h, 4);
      // Wall highlight
      g.fillStyle(0x94a3b8, 0.3);
      g.fillRoundedRect(4, y0 + 1, s - 8, h / 3, 3);
      // Bricks pattern
      g.lineStyle(1, 0x475569, 0.6);
      g.lineBetween(2, y0 + h/3, s - 2, y0 + h/3);
      g.lineBetween(2, y0 + 2*h/3, s - 2, y0 + 2*h/3);
      for (let i = 1; i < 5; i++) {
        const xOff = (i % 2 === 0) ? 5 : 0;
        g.lineBetween(xOff + i * (s-4)/5, y0, xOff + i * (s-4)/5, y0 + h/3);
        g.lineBetween(xOff + 3 + i * (s-4)/5, y0 + h/3, xOff + 3 + i * (s-4)/5, y0 + 2*h/3);
      }
      // Glow runes (shield pattern)
      g.fillStyle(0x38bdf8, 0.8);
      g.fillCircle(12, s/2, 3);
      g.fillCircle(s/2, s/2, 3);
      g.fillCircle(s - 12, s/2, 3);
      // Shield icon center (bigger)
      g.lineStyle(2, 0x38bdf8, 1);
      g.strokeCircle(s/2, s/2, 7);
      g.fillStyle(0x38bdf8, 0.3);
      g.fillCircle(s/2, s/2, 7);
      // Glow effect
      g.fillStyle(0x38bdf8, 0.1);
      g.fillCircle(s/2, s/2, 14);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeRoundedRect(2, y0, s - 4, h, 4);
    }, 50, 50);

    // Cooling System — spinning cyan fan (bigger)
    this.createDetailedUnit('cooling-system', 40, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(s/2, s - 3, s/2, 5);
      // Base plate
      g.fillStyle(0x334155);
      g.fillCircle(s/2, s/2, s/2 - 3);
      // Plate highlight
      g.fillStyle(0x475569, 0.4);
      g.fillCircle(s/2 - 3, s/2 - 3, s/3);
      // Fan blades (bigger, more detailed)
      g.fillStyle(0x22d3ee, 0.85);
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const cx = s/2, cy = s/2;
        const x1 = cx + Math.cos(angle) * 5;
        const y1 = cy + Math.sin(angle) * 5;
        const x2 = cx + Math.cos(angle + 0.5) * 15;
        const y2 = cy + Math.sin(angle + 0.5) * 15;
        const x3 = cx + Math.cos(angle - 0.2) * 15;
        const y3 = cy + Math.sin(angle - 0.2) * 15;
        g.fillTriangle(x1, y1, x2, y2, x3, y3);
      }
      // Fan center hub
      g.fillStyle(0x0ea5e9);
      g.fillCircle(s/2, s/2, 6);
      g.fillStyle(0x38bdf8, 0.5);
      g.fillCircle(s/2 - 1, s/2 - 1, 3);
      // Frost particles
      g.fillStyle(0xbae6fd, 0.7);
      g.fillCircle(s/2 - 10, s/2 - 10, 2.5);
      g.fillCircle(s/2 + 12, s/2 - 8, 2);
      g.fillCircle(s/2 - 8, s/2 + 12, 2);
      g.fillCircle(s/2 + 10, s/2 + 10, 1.5);
      // Frost glow
      g.fillStyle(0x22d3ee, 0.1);
      g.fillCircle(s/2, s/2, s/2);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeCircle(s/2, s/2, s/2 - 3);
    });
  }

  // ── Enemy Units (menacing, hot, Clash Royale villain style — BIGGER) ──
  private generateEnemyUnits() {
    // Heat Creep — fiery red blob with angry eyes (bigger)
    this.createDetailedUnit('heat-creep', 38, (g, s) => {
      // Fire aura glow
      g.fillStyle(0xff6b00, 0.15);
      g.fillCircle(s/2, s/2, s/2);
      // Body
      g.fillStyle(0xef4444);
      g.fillCircle(s/2, s/2 + 2, s/2 - 5);
      // Body highlight
      g.fillStyle(0xf87171, 0.4);
      g.fillCircle(s/2 - 3, s/2 - 2, s/3);
      // Flame crown (multiple flames)
      g.fillStyle(0xff8c00);
      g.fillTriangle(s/2, 0, s/2 - 6, 10, s/2 + 6, 10);
      g.fillStyle(0xfbbf24);
      g.fillTriangle(s/2, 2, s/2 - 4, 9, s/2 + 4, 9);
      g.fillStyle(0xff8c00);
      g.fillTriangle(s/2 - 6, 2, s/2 - 11, 12, s/2 - 1, 12);
      g.fillTriangle(s/2 + 6, 2, s/2 + 1, 12, s/2 + 11, 12);
      g.fillStyle(0xfbbf24, 0.6);
      g.fillTriangle(s/2 - 5, 4, s/2 - 9, 11, s/2 - 2, 11);
      g.fillTriangle(s/2 + 5, 4, s/2 + 2, 11, s/2 + 9, 11);
      // Angry eyes (big, expressive)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 6, s/2, 6);
      g.fillCircle(s/2 + 6, s/2, 6);
      // Angry pupils
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 5, s/2 + 1, 3);
      g.fillCircle(s/2 + 7, s/2 + 1, 3);
      // Eye shine
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(s/2 - 7, s/2 - 2, 1.5);
      g.fillCircle(s/2 + 5, s/2 - 2, 1.5);
      // Angry brows (thick, dramatic)
      g.lineStyle(2.5, 0x7f1d1d);
      g.lineBetween(s/2 - 12, s/2 - 7, s/2 - 2, s/2 - 4);
      g.lineBetween(s/2 + 12, s/2 - 7, s/2 + 2, s/2 - 4);
      // Grumpy mouth
      g.lineStyle(2, 0x7f1d1d);
      g.beginPath();
      g.arc(s/2, s/2 + 12, 5, Math.PI + 0.3, -0.3, false);
      g.strokePath();
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeCircle(s/2, s/2 + 2, s/2 - 5);
    });

    // DDoS mini — tiny pink skull (slightly bigger)
    this.createDetailedUnit('ddos-mini', 20, (g, s) => {
      g.fillStyle(0xf472b6);
      g.fillCircle(s/2, s/2, s/2 - 2);
      // Highlight
      g.fillStyle(0xf9a8d4, 0.4);
      g.fillCircle(s/2 - 2, s/2 - 2, s/4);
      // Eyes (X marks, bigger)
      g.lineStyle(2, 0x1a1a2e);
      g.lineBetween(s/2 - 5, s/2 - 3, s/2 - 1, s/2 + 1);
      g.lineBetween(s/2 - 1, s/2 - 3, s/2 - 5, s/2 + 1);
      g.lineBetween(s/2 + 1, s/2 - 3, s/2 + 5, s/2 + 1);
      g.lineBetween(s/2 + 5, s/2 - 3, s/2 + 1, s/2 + 1);
      // Thick outline
      g.lineStyle(2.5, 0x000000, 1);
      g.strokeCircle(s/2, s/2, s/2 - 2);
    });

    // Ransomware — big dark menacing lock (bigger, scarier)
    this.createDetailedUnit('ransomware', 46, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(6, s/3 + 4, s - 8, s * 2/3 - 4, 6);
      // Body
      g.fillStyle(0x7f1d1d);
      g.fillRoundedRect(4, s/3, s - 8, s * 2/3 - 4, 6);
      // Body gradient
      g.fillStyle(0x991b1b, 0.4);
      g.fillRoundedRect(6, s/3 + 2, s - 12, s/3 - 2, 4);
      // Lock shackle (thicker)
      g.lineStyle(5, 0x991b1b);
      g.beginPath();
      g.arc(s/2, s/3, 10, Math.PI, 0, false);
      g.strokePath();
      // Shackle highlight
      g.lineStyle(2, 0xb91c1c, 0.5);
      g.beginPath();
      g.arc(s/2, s/3, 8, Math.PI + 0.3, -0.3, false);
      g.strokePath();
      // Keyhole (bigger, glowing)
      g.fillStyle(0xfbbf24, 0.3);
      g.fillCircle(s/2, s/2 + 5, 8);
      g.fillStyle(0xfbbf24);
      g.fillCircle(s/2, s/2 + 4, 5);
      g.fillRect(s/2 - 2, s/2 + 7, 4, 8);
      // Skull decoration eyes
      g.fillStyle(0xef4444, 0.7);
      g.fillCircle(s/2 - 10, s/3 + 10, 3);
      g.fillCircle(s/2 + 10, s/3 + 10, 3);
      // Danger symbol
      g.fillStyle(0xef4444, 0.5);
      g.fillTriangle(s/2, s - 12, s/2 - 5, s - 6, s/2 + 5, s - 6);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeRoundedRect(4, s/3, s - 8, s * 2/3 - 4, 6);
    });

    // Zero-Day — fast yellow lightning bolt shape (bigger)
    this.createDetailedUnit('zero-day', 36, (g, s) => {
      // Glow aura
      g.fillStyle(0xfbbf24, 0.12);
      g.fillCircle(s/2, s/2, s/2);
      // Lightning body
      g.fillStyle(0xfbbf24);
      const pts = [
        s/2 + 3, 0,
        s/2 - 8, s/2 - 1,
        s/2 - 1, s/2 - 1,
        s/2 - 6, s,
        s/2 + 8, s/2 + 2,
        s/2 + 1, s/2 + 2,
      ];
      g.fillPoints(this.toPoints(pts), true);
      // Inner highlight
      g.fillStyle(0xfde68a, 0.5);
      const inner = [
        s/2 + 2, 4,
        s/2 - 5, s/2 - 1,
        s/2, s/2 - 1,
        s/2 - 3, s - 4,
        s/2 + 5, s/2 + 2,
        s/2 + 1, s/2 + 2,
      ];
      g.fillPoints(this.toPoints(inner), true);
      // Electric sparks
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(s/2 - 5, s/4, 2);
      g.fillCircle(s/2 + 7, s * 3/4, 2);
      g.fillCircle(s/2 + 3, s/3, 1.5);
      // Mini eyes on bolt
      g.fillStyle(0x000000, 0.8);
      g.fillCircle(s/2 - 2, s/2 - 4, 2);
      g.fillCircle(s/2 + 4, s/2 - 4, 2);
      // Thick outline
      g.lineStyle(3, 0x000000, 1);
      g.strokePoints(this.toPoints(pts), true);
    });

    // Cryptominer — purple crystal/gem that drains resources (bigger)
    this.createDetailedUnit('cryptominer', 40, (g, s) => {
      // Glow aura
      g.fillStyle(0x8b5cf6, 0.1);
      g.fillCircle(s/2, s/2, s/2);
      // Gem body
      g.fillStyle(0x8b5cf6);
      const gemPts = [
        s/2, 3,
        s - 5, s/3,
        s - 3, s * 2/3,
        s/2, s - 3,
        3, s * 2/3,
        5, s/3,
      ];
      g.fillPoints(this.toPoints(gemPts), true);
      // Inner facets (multi-layered)
      g.fillStyle(0xa78bfa, 0.5);
      g.fillTriangle(s/2, 8, s/2 + 12, s/2, s/2, s/2);
      g.fillStyle(0x7c3aed, 0.5);
      g.fillTriangle(s/2, 8, s/2, s/2, s/2 - 12, s/2);
      g.fillStyle(0xc4b5fd, 0.3);
      g.fillTriangle(s/2, s/2, s - 5, s * 2/3, s/2, s - 5);
      // Sparkle highlights
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(s/2 - 5, s/3 + 2, 2.5);
      g.fillCircle(s/2 + 8, s/2, 1.5);
      // Bitcoin symbol (bigger)
      g.lineStyle(2, 0xfbbf24);
      g.lineBetween(s/2, s/2 + 2, s/2, s/2 + 12);
      g.strokeCircle(s/2, s/2 + 7, 5);
      // "B" hint
      g.fillStyle(0xfbbf24, 0.7);
      g.fillCircle(s/2, s/2 + 7, 2);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokePoints(this.toPoints(gemPts), true);
    });
  }

  // ── Towers (imposing, detailed, Clash Royale style) ──
  private generateTowers() {
    // Server Rack (lane tower — bigger, more detailed)
    {
      const w = 56, h = 68;
      const g = this.add.graphics();
      // Shadow
      g.fillStyle(0x000000, 0.35);
      g.fillRoundedRect(5, 7, w, h, 7);
      // Main body
      g.fillStyle(0x475569);
      g.fillRoundedRect(2, 2, w, h, 7);
      // Body highlight
      g.fillStyle(0x64748b, 0.5);
      g.fillRoundedRect(4, 4, w/2, h/3, 5);
      // Front panel
      g.fillStyle(0x64748b);
      g.fillRoundedRect(6, 6, w - 8, h - 8, 5);
      // Server slots (5 slots)
      for (let i = 0; i < 5; i++) {
        const slotY = 10 + i * 11;
        g.fillStyle(0x334155);
        g.fillRoundedRect(9, slotY, w - 14, 9, 2);
        // Status lights (3 per slot)
        g.fillStyle(0x22c55e);
        g.fillCircle(14, slotY + 4.5, 2.5);
        // Light glow
        g.fillStyle(0x22c55e, 0.3);
        g.fillCircle(14, slotY + 4.5, 4);
        g.fillStyle(0x22c55e, 0.4);
        g.fillCircle(20, slotY + 4.5, 2);
        g.fillStyle(0xfbbf24, 0.5);
        g.fillCircle(26, slotY + 4.5, 2);
        // Drive bays
        g.fillStyle(0x1e293b);
        g.fillRect(32, slotY + 1, 14, 7);
        g.lineStyle(0.5, 0x475569, 0.6);
        g.lineBetween(36, slotY + 1, 36, slotY + 8);
        g.lineBetween(40, slotY + 1, 40, slotY + 8);
        g.lineBetween(44, slotY + 1, 44, slotY + 8);
      }
      // Top vent
      g.lineStyle(1.5, 0x334155);
      for (let x = 10; x < w - 4; x += 4) {
        g.lineBetween(x, 4, x + 2, 4);
      }
      // Bottom feet
      g.fillStyle(0x334155);
      g.fillRect(8, h - 2, 8, 3);
      g.fillRect(w - 12, h - 2, 8, 3);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeRoundedRect(2, 2, w, h, 7);
      g.generateTexture('server-rack', w + 8, h + 10);
      g.destroy();
    }

    // Main Server (king tower — bigger, golden, impressive)
    {
      const w = 80, h = 76;
      const g = this.add.graphics();
      // Shadow
      g.fillStyle(0x000000, 0.35);
      g.fillRoundedRect(5, 8, w, h, 10);
      // Main body
      g.fillStyle(0x78716c);
      g.fillRoundedRect(2, 2, w, h, 10);
      // Body highlight
      g.fillStyle(0x8b8580, 0.4);
      g.fillRoundedRect(4, 4, w/2, h/3, 8);
      // Gold trim (top & bottom)
      g.fillStyle(0xfbbf24);
      g.fillRoundedRect(2, 2, w, 8, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillRoundedRect(2, h - 6, w, 6, { tl: 0, tr: 0, bl: 10, br: 10 });
      // Gold trim highlight
      g.fillStyle(0xfcd34d, 0.5);
      g.fillRoundedRect(4, 3, w - 4, 4, { tl: 8, tr: 8, bl: 0, br: 0 });
      // Front panel
      g.fillStyle(0x57534e);
      g.fillRoundedRect(8, 14, w - 12, h - 24, 5);
      // Big server slots (4 slots)
      for (let i = 0; i < 4; i++) {
        const slotY = 18 + i * 13;
        g.fillStyle(0x292524);
        g.fillRoundedRect(12, slotY, w - 20, 10, 2);
        // Traffic light indicators
        g.fillStyle(0xef4444);
        g.fillCircle(18, slotY + 5, 2.5);
        g.fillStyle(0xef4444, 0.3);
        g.fillCircle(18, slotY + 5, 4);
        g.fillStyle(0xfbbf24);
        g.fillCircle(25, slotY + 5, 2.5);
        g.fillStyle(0xfbbf24, 0.3);
        g.fillCircle(25, slotY + 5, 4);
        g.fillStyle(0x22c55e);
        g.fillCircle(32, slotY + 5, 2.5);
        g.fillStyle(0x22c55e, 0.3);
        g.fillCircle(32, slotY + 5, 4);
        // Drive bays
        g.fillStyle(0x1e293b);
        g.fillRect(40, slotY + 1, 20, 8);
      }
      // Crown/star emblem (bigger, more detailed)
      const cx = w/2 + 1, cy = h - 16;
      // Emblem glow
      g.fillStyle(0xfbbf24, 0.2);
      g.fillCircle(cx, cy, 12);
      // Star shape
      g.fillStyle(0xfbbf24);
      g.fillTriangle(cx, cy - 8, cx - 8, cy, cx + 8, cy);
      g.fillTriangle(cx, cy + 8, cx - 8, cy, cx + 8, cy);
      // Star inner
      g.fillStyle(0xfde68a, 0.6);
      g.fillTriangle(cx, cy - 5, cx - 5, cy, cx + 5, cy);
      g.fillTriangle(cx, cy + 5, cx - 5, cy, cx + 5, cy);
      // Star center
      g.fillStyle(0xffffff, 0.4);
      g.fillCircle(cx, cy, 3);
      // Bottom feet
      g.fillStyle(0x57534e);
      g.fillRect(10, h - 2, 10, 4);
      g.fillRect(w - 16, h - 2, 10, 4);
      // Thick black outline
      g.lineStyle(3.5, 0x000000, 1);
      g.strokeRoundedRect(2, 2, w, h, 10);
      g.generateTexture('main-server', w + 8, h + 12);
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
