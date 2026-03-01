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
    // Junior Tech — green guy with hard hat (bigger, cuter, Supercell style)
    this.createDetailedUnit('junior-tech', 38, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(s/2, s - 3, s/2 + 3, 7);
      // Body (round, chubby)
      g.fillStyle(0x4ade80);
      g.fillCircle(s/2, s/2 + 3, s/2 - 5);
      // Body highlight (top-left glow)
      g.fillStyle(0x86efac, 0.5);
      g.fillCircle(s/2 - 4, s/2 - 3, s/3);
      // Body darker underside
      g.fillStyle(0x22c55e, 0.3);
      g.fillCircle(s/2 + 2, s/2 + 8, s/4);
      // Hard hat
      g.fillStyle(0xfbbf24);
      g.fillRoundedRect(s/2 - 12, 0, 24, 11, 4);
      g.fillRect(s/2 - 14, 9, 28, 4);
      // Hat highlight
      g.fillStyle(0xfde68a, 0.7);
      g.fillRoundedRect(s/2 - 9, 2, 14, 5, 2);
      // Hat dark band
      g.fillStyle(0xd97706, 0.5);
      g.fillRect(s/2 - 12, 7, 24, 2);
      // Big eyes (Supercell style — bigger, more expressive)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 6, s/2, 7);
      g.fillCircle(s/2 + 6, s/2, 7);
      // Pupils (looking forward-right)
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 4, s/2, 3.5);
      g.fillCircle(s/2 + 8, s/2, 3.5);
      // Eye shine (two per eye for depth)
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(s/2 - 5, s/2 - 2, 2);
      g.fillCircle(s/2 + 7, s/2 - 2, 2);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(s/2 - 3, s/2 + 1, 1);
      g.fillCircle(s/2 + 9, s/2 + 1, 1);
      // Happy mouth (wider grin)
      g.lineStyle(2, 0x166534);
      g.beginPath();
      g.arc(s/2, s/2 + 6, 6, 0.2, Math.PI - 0.2, false);
      g.strokePath();
      // Blush cheeks
      g.fillStyle(0xf472b6, 0.2);
      g.fillCircle(s/2 - 10, s/2 + 3, 4);
      g.fillCircle(s/2 + 10, s/2 + 3, 4);
      // Wrench in hand
      g.fillStyle(0x94a3b8);
      g.fillRect(s - 8, s/2 + 2, 3, 11);
      g.fillCircle(s - 6, s/2 + 2, 3);
      g.fillStyle(0xb0bec5, 0.5);
      g.fillCircle(s - 6, s/2 + 2, 1.5);
      // Thick black outline
      g.lineStyle(3, 0x000000, 1);
      g.strokeCircle(s/2, s/2 + 3, s/2 - 5);
    });

    // Senior Engineer — blue tanky guy with glasses (bigger, more detail)
    this.createDetailedUnit('senior-engineer', 42, (g, s) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(s/2, s - 2, s/2 + 1, 7);
      // Body (square-ish, tanky)
      g.fillStyle(0x3b82f6);
      g.fillRoundedRect(4, 4, s - 8, s - 8, 7);
      // Body highlight (top-left shine)
      g.fillStyle(0x93c5fd, 0.35);
      g.fillRoundedRect(6, 6, s/2, s/2 - 4, 5);
      // Body darker bottom
      g.fillStyle(0x1d4ed8, 0.3);
      g.fillRoundedRect(6, s/2 + 4, s - 12, s/3, 5);
      // Collar (white shirt peek)
      g.fillStyle(0xffffff, 0.6);
      g.fillTriangle(s/2, 12, s/2 - 8, 18, s/2 + 8, 18);
      // Tie
      g.fillStyle(0xef4444);
      g.fillTriangle(s/2, 16, s/2 - 4, 24, s/2 + 4, 24);
      g.fillRect(s/2 - 2, 24, 4, 10);
      // Tie highlight
      g.fillStyle(0xf87171, 0.4);
      g.fillTriangle(s/2 - 1, 17, s/2 - 3, 23, s/2 + 1, 23);
      // Glasses (thick frames, glare)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 7, s/2 - 4, 6);
      g.fillCircle(s/2 + 7, s/2 - 4, 6);
      // Lens glare
      g.fillStyle(0xe0f2fe, 0.3);
      g.fillCircle(s/2 - 8, s/2 - 6, 3);
      g.fillCircle(s/2 + 6, s/2 - 6, 3);
      g.lineStyle(2.5, 0x1e3a5f);
      g.strokeCircle(s/2 - 7, s/2 - 4, 6);
      g.strokeCircle(s/2 + 7, s/2 - 4, 6);
      g.lineBetween(s/2 - 1, s/2 - 4, s/2 + 1, s/2 - 4);
      // Pupils
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 5, s/2 - 4, 2.5);
      g.fillCircle(s/2 + 9, s/2 - 4, 2.5);
      // Eye shine
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 6, s/2 - 6, 1.5);
      g.fillCircle(s/2 + 8, s/2 - 6, 1.5);
      // Determined mouth (slight frown)
      g.lineStyle(2, 0x1e3a8a);
      g.beginPath();
      g.arc(s/2, s/2 + 10, 4, Math.PI + 0.3, -0.3, false);
      g.strokePath();
      // Coffee mug (bigger, with steam)
      g.fillStyle(0xffffff);
      g.fillRoundedRect(s - 13, s/2, 8, 10, 2);
      g.lineStyle(1.5, 0x1e3a5f);
      g.strokeRoundedRect(s - 13, s/2, 8, 10, 2);
      // Mug handle
      g.lineStyle(1.5, 0x1e3a5f);
      g.beginPath();
      g.arc(s - 5, s/2 + 5, 3, -Math.PI/2, Math.PI/2, false);
      g.strokePath();
      // Steam
      g.lineStyle(1, 0xffffff, 0.3);
      g.lineBetween(s - 11, s/2 - 2, s - 10, s/2 - 5);
      g.lineBetween(s - 8, s/2 - 1, s - 7, s/2 - 4);
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
    // Heat Creep — fiery red blob with angry eyes (bigger, more menacing)
    this.createDetailedUnit('heat-creep', 38, (g, s) => {
      // Outer fire aura glow
      g.fillStyle(0xff6b00, 0.12);
      g.fillCircle(s/2, s/2, s/2 + 2);
      g.fillStyle(0xef4444, 0.08);
      g.fillCircle(s/2, s/2, s/2 + 4);
      // Body
      g.fillStyle(0xef4444);
      g.fillCircle(s/2, s/2 + 2, s/2 - 5);
      // Body highlight (hot center)
      g.fillStyle(0xf87171, 0.5);
      g.fillCircle(s/2 - 3, s/2 - 2, s/3);
      // Dark underside
      g.fillStyle(0xb91c1c, 0.4);
      g.fillCircle(s/2 + 2, s/2 + 6, s/4);
      // Flame crown (5 flames, varied heights)
      g.fillStyle(0xff8c00);
      g.fillTriangle(s/2, -2, s/2 - 5, 10, s/2 + 5, 10);
      g.fillTriangle(s/2 - 7, 1, s/2 - 12, 12, s/2 - 2, 12);
      g.fillTriangle(s/2 + 7, 1, s/2 + 2, 12, s/2 + 12, 12);
      // Flame tips (bright yellow)
      g.fillStyle(0xfbbf24);
      g.fillTriangle(s/2, 0, s/2 - 3, 8, s/2 + 3, 8);
      g.fillStyle(0xfde68a, 0.7);
      g.fillTriangle(s/2 - 7, 3, s/2 - 10, 10, s/2 - 4, 10);
      g.fillTriangle(s/2 + 7, 3, s/2 + 4, 10, s/2 + 10, 10);
      // Side flames (smaller)
      g.fillStyle(0xff8c00, 0.6);
      g.fillTriangle(s/2 - 13, 6, s/2 - 16, 14, s/2 - 10, 14);
      g.fillTriangle(s/2 + 13, 6, s/2 + 10, 14, s/2 + 16, 14);
      // Angry eyes (big, glowing)
      g.fillStyle(0xffffff);
      g.fillCircle(s/2 - 6, s/2, 7);
      g.fillCircle(s/2 + 6, s/2, 7);
      // Angry pupils (red tinted)
      g.fillStyle(0x1a1a2e);
      g.fillCircle(s/2 - 4, s/2 + 1, 3.5);
      g.fillCircle(s/2 + 8, s/2 + 1, 3.5);
      // Red iris ring
      g.lineStyle(0.5, 0xef4444, 0.5);
      g.strokeCircle(s/2 - 4, s/2 + 1, 3.5);
      g.strokeCircle(s/2 + 8, s/2 + 1, 3.5);
      // Eye shine
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(s/2 - 6, s/2 - 2, 2);
      g.fillCircle(s/2 + 6, s/2 - 2, 2);
      // Angry brows (thick V-shape)
      g.lineStyle(3, 0x7f1d1d);
      g.lineBetween(s/2 - 13, s/2 - 8, s/2 - 2, s/2 - 4);
      g.lineBetween(s/2 + 13, s/2 - 8, s/2 + 2, s/2 - 4);
      // Grumpy mouth (with teeth)
      g.lineStyle(2, 0x7f1d1d);
      g.beginPath();
      g.arc(s/2, s/2 + 12, 5, Math.PI + 0.3, -0.3, false);
      g.strokePath();
      // Teeth
      g.fillStyle(0xffffff, 0.7);
      g.fillRect(s/2 - 3, s/2 + 8, 2, 2);
      g.fillRect(s/2 + 1, s/2 + 8, 2, 2);
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

    // Checkerboard grass tiles (Clash Royale style — alternating light/dark squares)
    const tileSize = 24;
    for (let ty = 0; ty < H - 100; ty += tileSize) {
      for (let tx = 0; tx < W; tx += tileSize) {
        const checker = ((tx / tileSize) + (ty / tileSize)) % 2 === 0;
        g.fillStyle(checker ? 0x558c65 : 0x4a7c59);
        g.fillRect(tx, ty, tileSize, tileSize);
      }
    }

    // Subtle grass blade marks (tiny angled lines)
    for (let i = 0; i < 120; i++) {
      const gx = ((i * 37 + 13) % W);
      const gy = ((i * 53 + 7) % (H - 100));
      g.lineStyle(0.5, 0x3d6b4a, 0.2);
      g.lineBetween(gx, gy, gx + 2, gy - 3);
      g.lineBetween(gx + 1, gy, gx + 3, gy - 2);
    }

    // Subtle grass texture dots
    const grassColors = [0x5a9068, 0x3d6b4a, 0x6aa07a, 0x4f8a60];
    for (let i = 0; i < 200; i++) {
      const gx = ((i * 37 + 13) % W);
      const gy = ((i * 53 + 7) % (H - 100));
      g.fillStyle(grassColors[i % grassColors.length], 0.2);
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

    // -- River (wider, more detailed — Clash Royale style) --
    const riverY = 275;
    const riverH = 38;

    // River bed (dark underneath)
    g.fillStyle(0x1a3455, 0.9);
    g.fillRect(0, riverY + 2, W, riverH);

    // Main water body (gradient layers)
    g.fillStyle(0x1d4ed8, 0.8);
    g.fillRect(0, riverY, W, riverH);
    g.fillStyle(0x2563eb, 0.6);
    g.fillRect(0, riverY, W, riverH * 0.7);
    g.fillStyle(0x3b82f6, 0.4);
    g.fillRect(0, riverY, W, riverH * 0.4);

    // Foam wave crests (white wavy lines)
    g.lineStyle(1.5, 0xffffff, 0.12);
    for (let x = 0; x < W; x += 3) {
      const waveY = riverY + 8 + Math.sin(x * 0.08) * 3;
      g.fillStyle(0xffffff, 0.08);
      g.fillCircle(x, waveY, 1);
    }
    for (let x = 0; x < W; x += 4) {
      const waveY = riverY + riverH - 10 + Math.sin(x * 0.06 + 2) * 2;
      g.fillStyle(0xbfdbfe, 0.06);
      g.fillCircle(x, waveY, 1);
    }

    // Water shimmer waves (ellipses for depth)
    for (let x = 0; x < W; x += 18) {
      g.fillStyle(0x60a5fa, 0.3);
      g.fillEllipse(x + 10, riverY + riverH * 0.3, 14, 4);
      g.fillStyle(0x93c5fd, 0.15);
      g.fillEllipse(x + 5, riverY + riverH * 0.6, 12, 3);
    }

    // Sparkle highlights (brighter, more scattered)
    for (let i = 0; i < 15; i++) {
      const sx = ((i * 29 + 11) % W);
      const sy = riverY + 4 + ((i * 11) % (riverH - 8));
      g.fillStyle(0xffffff, 0.3);
      g.fillCircle(sx, sy, 1);
      g.fillStyle(0xffffff, 0.15);
      g.fillCircle(sx + 2, sy + 1, 0.5);
    }

    // River banks (stone edge with grass overhang)
    // Top bank
    g.fillStyle(0x5c4e38);
    g.fillRect(0, riverY - 5, W, 5);
    g.fillStyle(0x7a6c54, 0.7);
    g.fillRect(0, riverY - 3, W, 2);
    // Grass overhang top
    for (let x = 0; x < W; x += 8) {
      g.fillStyle(0x4a7c59, 0.6);
      g.fillEllipse(x + 4, riverY - 4, 6, 4);
    }
    // Bottom bank
    g.fillStyle(0x5c4e38);
    g.fillRect(0, riverY + riverH, W, 5);
    g.fillStyle(0x7a6c54, 0.7);
    g.fillRect(0, riverY + riverH + 1, W, 2);
    // Grass overhang bottom
    for (let x = 0; x < W; x += 8) {
      g.fillStyle(0x4a7c59, 0.6);
      g.fillEllipse(x + 4, riverY + riverH + 4, 6, 4);
    }

    // -- Bridges (two, one per lane — data cable / network bridge theme) --
    const bridgeW = 64;
    for (const laneX of laneXPositions) {
      // Bridge shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(laneX - bridgeW / 2 + 2, riverY - 7, bridgeW, riverH + 16, 3);

      // Bridge base (metal plate)
      g.fillStyle(0x8b8580);
      g.fillRoundedRect(laneX - bridgeW / 2, riverY - 7, bridgeW, riverH + 14, 3);

      // Bridge surface (lighter)
      g.fillStyle(0xa09a94);
      g.fillRoundedRect(laneX - bridgeW / 2 + 2, riverY - 5, bridgeW - 4, riverH + 10, 2);

      // Plank lines (metal grating)
      g.lineStyle(1, 0x78716c, 0.5);
      for (let by = riverY - 3; by < riverY + riverH + 5; by += 5) {
        g.lineBetween(laneX - bridgeW / 2 + 3, by, laneX + bridgeW / 2 - 3, by);
      }
      // Cross-hatching
      g.lineStyle(0.5, 0x78716c, 0.25);
      for (let bx = laneX - bridgeW / 2 + 8; bx < laneX + bridgeW / 2; bx += 10) {
        g.lineBetween(bx, riverY - 3, bx, riverY + riverH + 5);
      }

      // Data cable pipes along sides (colored tubes)
      const cableColors = [0xef4444, 0x22c55e, 0x3b82f6, 0xfbbf24];
      for (let ci = 0; ci < 4; ci++) {
        const cx = laneX - bridgeW / 2 + 5 + ci * 3;
        g.fillStyle(cableColors[ci], 0.5);
        g.fillRect(cx, riverY - 5, 2, riverH + 10);
      }
      for (let ci = 0; ci < 4; ci++) {
        const cx = laneX + bridgeW / 2 - 16 + ci * 3;
        g.fillStyle(cableColors[ci], 0.5);
        g.fillRect(cx, riverY - 5, 2, riverH + 10);
      }

      // Bridge stone edges (thicker, more detail)
      g.fillStyle(0x6b6560);
      g.fillRoundedRect(laneX - bridgeW / 2 - 1, riverY - 9, bridgeW + 2, 4, 2);
      g.fillRoundedRect(laneX - bridgeW / 2 - 1, riverY + riverH + 5, bridgeW + 2, 4, 2);
      // Edge highlight
      g.fillStyle(0x9e9890, 0.5);
      g.fillRect(laneX - bridgeW / 2, riverY - 8, bridgeW, 1);

      // Bridge pillars (stone columns)
      g.fillStyle(0x57534e);
      g.fillRoundedRect(laneX - bridgeW / 2 - 4, riverY - 11, 8, riverH + 24, 3);
      g.fillRoundedRect(laneX + bridgeW / 2 - 4, riverY - 11, 8, riverH + 24, 3);
      // Pillar highlight
      g.fillStyle(0x78716c, 0.4);
      g.fillRoundedRect(laneX - bridgeW / 2 - 3, riverY - 10, 4, riverH + 22, 2);
      g.fillRoundedRect(laneX + bridgeW / 2 - 3, riverY - 10, 4, riverH + 22, 2);
      // Pillar caps (gold accented)
      g.fillStyle(0x8b8580);
      g.fillRoundedRect(laneX - bridgeW / 2 - 5, riverY - 13, 10, 4, 2);
      g.fillRoundedRect(laneX + bridgeW / 2 - 5, riverY - 13, 10, 4, 2);
      g.fillStyle(0xfbbf24, 0.25);
      g.fillRect(laneX - bridgeW / 2 - 4, riverY - 12, 8, 1);
      g.fillRect(laneX + bridgeW / 2 - 4, riverY - 12, 8, 1);
    }

    // -- Lane divider (network cable conduit — data center style) --
    // Main conduit pipe
    g.fillStyle(0x475569, 0.35);
    for (let y = 0; y < H - 120; y += 2) {
      if (y > riverY - 8 && y < riverY + riverH + 8) continue;
      g.fillRect(W / 2 - 2, y, 4, 2);
    }
    // Cable highlight (center light streak)
    g.fillStyle(0x94a3b8, 0.15);
    for (let y = 0; y < H - 120; y += 2) {
      if (y > riverY - 8 && y < riverY + riverH + 8) continue;
      g.fillRect(W / 2 - 0.5, y, 1, 2);
    }
    // Junction boxes (every 50px)
    for (let y = 25; y < H - 120; y += 50) {
      if (y > riverY - 12 && y < riverY + riverH + 12) continue;
      g.fillStyle(0x475569, 0.5);
      g.fillRoundedRect(W / 2 - 5, y, 10, 8, 2);
      // Green status light
      g.fillStyle(0x22c55e, 0.4);
      g.fillCircle(W / 2, y + 4, 1.5);
    }

    // -- Enemy spawn zone (data center server room — dark, menacing) --
    // Dark ceiling
    g.fillStyle(0x0f0818, 0.7);
    g.fillRect(0, 0, W, 90);
    // Gradient fade
    g.fillStyle(0x0f0818, 0.4);
    g.fillRect(0, 90, W, 15);
    g.fillStyle(0x0f0818, 0.15);
    g.fillRect(0, 105, W, 10);
    // Server room ceiling tiles pattern
    g.lineStyle(0.5, 0x2a1f3a, 0.3);
    for (let x = 0; x < W; x += 30) {
      g.lineBetween(x, 0, x, 85);
    }
    for (let y = 0; y < 85; y += 22) {
      g.lineBetween(0, y, W, y);
    }
    // Red danger stripes (diagonal)
    g.lineStyle(1.5, 0xef4444, 0.08);
    for (let x = -90; x < W + 90; x += 16) {
      g.lineBetween(x, 0, x + 90, 90);
    }
    // Red glow at bottom of spawn zone
    g.fillStyle(0xef4444, 0.06);
    g.fillRect(0, 70, W, 20);
    // Warning lights
    for (let x = 30; x < W; x += 80) {
      // Red beacon
      g.fillStyle(0xef4444, 0.25);
      g.fillCircle(x, 15, 4);
      g.fillStyle(0xef4444, 0.1);
      g.fillCircle(x, 15, 8);
      // Danger triangle
      g.lineStyle(1, 0xef4444, 0.15);
      g.strokeTriangle(x, 25, x - 6, 35, x + 6, 35);
      g.fillStyle(0xef4444, 0.08);
      g.fillRect(x - 0.5, 28, 1, 4);
      g.fillCircle(x, 33, 0.8);
    }

    // -- Player deploy zone (subtle circuit board pattern) --
    g.fillStyle(0x22c55e, 0.04);
    g.fillRect(0, 350, W, 220);
    // Circuit trace lines (horizontal)
    g.lineStyle(0.5, 0x22c55e, 0.06);
    for (let y = 365; y < 560; y += 25) {
      g.lineBetween(0, y, W, y);
    }
    // Circuit trace lines (vertical)
    for (let x = 15; x < W; x += 35) {
      g.lineBetween(x, 350, x, 570);
    }
    // Circuit nodes (small dots at intersections)
    for (let y = 365; y < 560; y += 25) {
      for (let x = 15; x < W; x += 35) {
        g.fillStyle(0x22c55e, 0.08);
        g.fillCircle(x, y, 1.5);
      }
    }
    // Deploy zone glowing border
    g.lineStyle(1.5, 0x22c55e, 0.12);
    g.lineBetween(0, 350, W, 350);
    g.lineBetween(0, 570, W, 570);
    // Deploy zone text markers
    g.fillStyle(0x22c55e, 0.06);
    g.fillRect(5, 351, 50, 1);
    g.fillRect(W - 55, 351, 50, 1);

    // -- Tower platforms (raised server room floor panels) --
    // Lane tower platforms
    for (const laneX of laneXPositions) {
      // Platform shadow (larger for depth)
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(laneX, 600, 66, 24);
      // Raised platform base
      g.fillStyle(0x6b6560);
      g.fillEllipse(laneX, 597, 62, 22);
      // Platform top surface
      g.fillStyle(0x8b8580);
      g.fillEllipse(laneX, 595, 58, 20);
      // Platform highlight
      g.fillStyle(0xa09a94, 0.5);
      g.fillEllipse(laneX - 4, 593, 40, 14);
      // Gold ring
      g.lineStyle(1.5, 0xfbbf24, 0.35);
      g.strokeEllipse(laneX, 595, 58, 20);
      // Inner green glow ring (active tower indicator)
      g.lineStyle(1, 0x22c55e, 0.2);
      g.strokeEllipse(laneX, 595, 48, 16);
      // Cable connections from platform
      g.fillStyle(0x475569, 0.3);
      g.fillRect(laneX - 25, 600, 3, 8);
      g.fillRect(laneX + 22, 600, 3, 8);
    }

    // Main server platform (larger, golden, more imposing)
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(W / 2, 660, 92, 30);
    // Base tier
    g.fillStyle(0x57534e);
    g.fillEllipse(W / 2, 658, 88, 28);
    // Top surface
    g.fillStyle(0x8b8580);
    g.fillEllipse(W / 2, 655, 84, 26);
    // Surface highlight
    g.fillStyle(0xa09a94, 0.4);
    g.fillEllipse(W / 2 - 5, 653, 60, 18);
    // Gold accent ring
    g.fillStyle(0xfbbf24, 0.12);
    g.fillEllipse(W / 2, 654, 74, 22);
    g.lineStyle(2.5, 0xfbbf24, 0.5);
    g.strokeEllipse(W / 2, 655, 84, 26);
    // Inner gold ring
    g.lineStyle(1, 0xfbbf24, 0.2);
    g.strokeEllipse(W / 2, 655, 70, 20);
    // Green glow ring
    g.lineStyle(1, 0x22c55e, 0.15);
    g.strokeEllipse(W / 2, 655, 60, 16);

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

    // -- Bottom HUD area (dark panel with metallic feel) --
    g.fillStyle(0x1a1736);
    g.fillRect(0, H - 100, W, 100);
    // Panel gradient top (darker to lighter)
    g.fillStyle(0x231f42, 0.8);
    g.fillRect(0, H - 100, W, 10);
    g.fillStyle(0x1e1a35, 0.6);
    g.fillRect(0, H - 90, W, 5);
    // Gold trim on HUD (thicker)
    g.fillStyle(0xfbbf24, 0.4);
    g.fillRect(0, H - 100, W, 2);
    // Inner gold line
    g.fillStyle(0xfbbf24, 0.15);
    g.fillRect(0, H - 98, W, 1);
    // Subtle corner accents
    g.fillStyle(0xfbbf24, 0.1);
    g.fillTriangle(0, H - 100, 15, H - 100, 0, H - 85);
    g.fillTriangle(W, H - 100, W - 15, H - 100, W, H - 85);
    // Side trim lines
    g.fillStyle(0xfbbf24, 0.08);
    g.fillRect(0, H - 100, 1, 100);
    g.fillRect(W - 1, H - 100, 1, 100);

    // -- Edge vignette (corners + sides darker, more dramatic) --
    g.fillStyle(0x0a0a1e, 0.25);
    g.fillCircle(0, 0, 60);
    g.fillCircle(W, 0, 60);
    g.fillCircle(0, H - 100, 50);
    g.fillCircle(W, H - 100, 50);
    // Side darkening strips
    g.fillStyle(0x0a0a1e, 0.1);
    g.fillRect(0, 0, 6, H - 100);
    g.fillRect(W - 6, 0, 6, H - 100);
    // Top edge darkening (below enemy zone)
    g.fillStyle(0x0a0a1e, 0.06);
    g.fillRect(0, 115, W, 10);

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
