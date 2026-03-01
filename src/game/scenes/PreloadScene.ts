import Phaser from 'phaser';
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
    // ── Player Units ──
    // Junior Tech (green circle)
    this.createCircleTexture('junior-tech', 12, 0x22cc66);
    // Senior Engineer (blue square)
    this.createSquareTexture('senior-engineer', 14, 0x3388ff);
    // AI Bot (orange triangle)
    this.createTriangleTexture('ai-bot', 14, 0xff8833);
    // Firewall (gray wall)
    this.createWallTexture('firewall', 30, 16, 0x888899);
    // Cooling System (cyan diamond)
    this.createDiamondTexture('cooling-system', 14, 0x44ddee);

    // ── Enemy Units ──
    // Heat Creep (red circle)
    this.createCircleTexture('heat-creep', 12, 0xee3333);
    // DDoS Swarm mini (pink dots)
    this.createCircleTexture('ddos-mini', 7, 0xff66aa);
    // Ransomware (dark red large)
    this.createSquareTexture('ransomware', 18, 0x991111);
    // Zero-Day (yellow fast shape)
    this.createTriangleTexture('zero-day', 12, 0xffdd22);
    // Cryptominer (purple)
    this.createDiamondTexture('cryptominer', 14, 0x9944ff);

    // ── Towers ──
    this.createTowerTexture('server-rack', 40, 50, 0x556677, 0x22cc66);
    this.createTowerTexture('main-server', 60, 55, 0x887744, 0xff4444);

    // ── Cards ──
    this.createCardBackground('card-bg', 70, 90);

    // ── Projectiles ──
    this.createCircleTexture('bullet', 3, 0xffffff);

    // ── Effects ──
    this.createCircleTexture('area-effect', 40, 0x44ddee, 0.25);
    this.createCircleTexture('heal-effect', 30, 0x22cc66, 0.3);

    // ── Arena ──
    this.createArenaBackground();

    // ── Spell effects ──
    this.createCircleTexture('power-surge', 50, 0xffaa00, 0.4);
  }

  private createCircleTexture(key: string, radius: number, color: number, alpha: number = 1) {
    const g = this.add.graphics();
    g.fillStyle(color, alpha);
    g.fillCircle(radius, radius, radius);
    g.lineStyle(2, 0xffffff, alpha * 0.5);
    g.strokeCircle(radius, radius, radius);
    g.generateTexture(key, radius * 2, radius * 2);
    g.destroy();
  }

  private createSquareTexture(key: string, size: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color);
    g.fillRoundedRect(0, 0, size, size, 3);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokeRoundedRect(0, 0, size, size, 3);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  private createTriangleTexture(key: string, size: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color);
    g.fillTriangle(size, 0, 0, size * 1.5, size * 2, size * 1.5);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokeTriangle(size, 0, 0, size * 1.5, size * 2, size * 1.5);
    g.generateTexture(key, size * 2, size * 1.5);
    g.destroy();
  }

  private createDiamondTexture(key: string, size: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color);
    g.fillPoints([
      new Phaser.Geom.Point(size, 0),
      new Phaser.Geom.Point(size * 2, size),
      new Phaser.Geom.Point(size, size * 2),
      new Phaser.Geom.Point(0, size),
    ], true);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokePoints([
      new Phaser.Geom.Point(size, 0),
      new Phaser.Geom.Point(size * 2, size),
      new Phaser.Geom.Point(size, size * 2),
      new Phaser.Geom.Point(0, size),
    ], true);
    g.generateTexture(key, size * 2, size * 2);
    g.destroy();
  }

  private createWallTexture(key: string, width: number, height: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color);
    g.fillRoundedRect(0, 0, width, height, 2);
    g.lineStyle(2, 0xffffff, 0.4);
    g.strokeRoundedRect(0, 0, width, height, 2);
    // brick pattern
    g.lineStyle(1, 0x000000, 0.3);
    g.lineBetween(0, height / 2, width, height / 2);
    g.lineBetween(width / 3, 0, width / 3, height / 2);
    g.lineBetween(width * 2 / 3, height / 2, width * 2 / 3, height);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  private createTowerTexture(key: string, width: number, height: number, baseColor: number, lightColor: number) {
    const g = this.add.graphics();
    // Base
    g.fillStyle(baseColor);
    g.fillRoundedRect(0, 0, width, height, 4);
    g.lineStyle(2, 0xffffff, 0.3);
    g.strokeRoundedRect(0, 0, width, height, 4);
    // Server lights
    for (let i = 0; i < 3; i++) {
      g.fillStyle(lightColor);
      g.fillCircle(10 + i * 12, height / 2, 3);
    }
    // Rack lines
    g.lineStyle(1, 0x000000, 0.4);
    for (let y = 10; y < height - 5; y += 12) {
      g.lineBetween(3, y, width - 3, y);
    }
    g.generateTexture(key, width, height);
    g.destroy();
  }

  private createCardBackground(key: string, width: number, height: number) {
    const g = this.add.graphics();
    g.fillStyle(0x1a1a3e);
    g.fillRoundedRect(0, 0, width, height, 8);
    g.lineStyle(2, 0x4444aa);
    g.strokeRoundedRect(0, 0, width, height, 8);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  private createArenaBackground() {
    const g = this.add.graphics();
    // Dark background
    g.fillStyle(0x1a1a2e);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Grid lines
    g.lineStyle(1, 0x2a2a4e, 0.3);
    for (let x = 0; x < GAME_WIDTH; x += 40) {
      g.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += 40) {
      g.lineBetween(0, y, GAME_WIDTH, y);
    }

    // Lane divider (center vertical line)
    g.lineStyle(2, 0x3a3a6e, 0.5);
    g.lineBetween(GAME_WIDTH / 2, 80, GAME_WIDTH / 2, 560);

    // Enemy spawn zone (top)
    g.fillStyle(0x331111, 0.3);
    g.fillRect(0, 0, GAME_WIDTH, 80);

    // Player deploy zone indicator
    g.fillStyle(0x113311, 0.15);
    g.fillRect(0, 400, GAME_WIDTH, 160);

    g.generateTexture('arena-bg', GAME_WIDTH, GAME_HEIGHT);
    g.destroy();
  }
}
