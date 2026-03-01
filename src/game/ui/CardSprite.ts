import * as Phaser from 'phaser';
import { CardDef } from '../config/cards';

export class CardSprite extends Phaser.GameObjects.Container {
  cardDef: CardDef;
  index: number;
  bg: Phaser.GameObjects.Graphics;
  nameText: Phaser.GameObjects.Text;
  costBadge: Phaser.GameObjects.Graphics;
  costText: Phaser.GameObjects.Text;
  icon: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | null = null;
  isSelected: boolean = false;
  isAffordable: boolean = true;
  private levelStar: Phaser.GameObjects.Graphics;

  static readonly W = 78;
  static readonly H = 96;

  constructor(scene: Phaser.Scene, x: number, y: number, card: CardDef, index: number) {
    super(scene, x, y);
    this.cardDef = card;
    this.index = index;

    // Card background
    this.bg = scene.add.graphics();
    this.drawCard(false);
    this.add(this.bg);

    // Unit icon or spell symbol (bigger, centered in art area)
    if (card.type === 'unit' && scene.textures.exists(card.texture)) {
      this.icon = scene.add.sprite(0, -10, card.texture).setScale(1.3);
      this.add(this.icon);
    } else {
      const symbols: Record<string, string> = {
        heal: '\u2764',
        push: '\u21c4',
        overclock: '\u26a1',
      };
      const sym = scene.add.text(0, -14, symbols[card.spellEffect || ''] || '?', {
        fontSize: '28px',
        color: `#${card.color.toString(16).padStart(6, '0')}`,
      }).setOrigin(0.5);
      this.icon = sym;
      this.add(sym);
    }

    // Name in bottom banner
    this.nameText = scene.add.text(0, 30, card.name, {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Cost badge (elixir drop — bigger, more prominent)
    this.costBadge = scene.add.graphics();
    this.drawCostBadge();
    this.add(this.costBadge);

    this.costText = scene.add.text(-29, -40, `${card.cost}`, {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(this.costText);

    // Level star (bottom-right)
    this.levelStar = scene.add.graphics();
    this.drawLevelStar();
    this.add(this.levelStar);

    this.setSize(CardSprite.W, CardSprite.H);
    this.setInteractive();
    this.setDepth(60);
    scene.add.existing(this);
  }

  private drawCostBadge() {
    this.costBadge.clear();
    const cx = -29, cy = -38;
    // Drop shadow
    this.costBadge.fillStyle(0x000000, 0.4);
    this.costBadge.fillCircle(cx + 1, cy + 1, 12);
    // Purple elixir drop (Clash Royale pink-purple)
    this.costBadge.fillStyle(0xc026d3);
    this.costBadge.fillCircle(cx, cy, 12);
    // Lighter top
    this.costBadge.fillStyle(0xd946ef, 0.5);
    this.costBadge.fillCircle(cx - 2, cy - 3, 6);
    // Bright highlight
    this.costBadge.fillStyle(0xffffff, 0.3);
    this.costBadge.fillCircle(cx - 3, cy - 5, 3);
    // Gold border
    this.costBadge.lineStyle(2, 0xfbbf24, 0.9);
    this.costBadge.strokeCircle(cx, cy, 12);
  }

  private drawLevelStar() {
    this.levelStar.clear();
    const sx = 27, sy = 34;
    // Star glow
    this.levelStar.fillStyle(0xfbbf24, 0.3);
    this.levelStar.fillCircle(sx, sy, 7);
    // Star body
    this.levelStar.fillStyle(0xfbbf24);
    this.levelStar.fillTriangle(sx, sy - 5, sx - 5, sy + 3, sx + 5, sy + 3);
    this.levelStar.fillTriangle(sx, sy + 5, sx - 5, sy - 1, sx + 5, sy - 1);
    // Star center
    this.levelStar.fillStyle(0xfde68a, 0.6);
    this.levelStar.fillCircle(sx, sy, 2);
  }

  private drawCard(selected: boolean) {
    this.bg.clear();
    const w = CardSprite.W, h = CardSprite.H;

    // Drop shadow
    this.bg.fillStyle(0x000000, 0.6);
    this.bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 4, w, h, 10);

    // Main card body
    if (!this.isAffordable) {
      this.bg.fillStyle(0x1a1828, 0.95);
    } else if (selected) {
      this.bg.fillStyle(0x3b3880);
    } else {
      this.bg.fillStyle(0x2d2a4a);
    }
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Art area (top 60% of card — lighter panel for character)
    const artH = h * 0.55;
    const artColor = selected ? 0x4a4690 : this.isAffordable ? 0x3d3a5e : 0x252240;
    this.bg.fillStyle(artColor);
    this.bg.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, artH, { tl: 7, tr: 7, bl: 0, br: 0 });

    // Art area color tint from card type
    if (this.cardDef) {
      this.bg.fillStyle(this.cardDef.color, 0.1);
      this.bg.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, artH, { tl: 7, tr: 7, bl: 0, br: 0 });
    }

    // Top highlight (glass effect)
    this.bg.fillStyle(0xffffff, selected ? 0.12 : 0.06);
    this.bg.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w - 10, artH / 2, { tl: 6, tr: 6, bl: 0, br: 0 });

    // Name banner area (bottom section)
    const bannerY = -h / 2 + artH + 2;
    const bannerH = h - artH - 6;
    this.bg.fillStyle(selected ? 0x2a275a : this.isAffordable ? 0x1e1b3a : 0x18162e);
    this.bg.fillRoundedRect(-w / 2 + 4, bannerY, w - 8, bannerH, { tl: 0, tr: 0, bl: 7, br: 7 });

    // Rarity color bar at banner top
    if (this.cardDef) {
      this.bg.fillStyle(this.cardDef.color, this.isAffordable ? 0.6 : 0.2);
      this.bg.fillRect(-w / 2 + 6, bannerY, w - 12, 3);
    }

    // Card border
    const borderColor = selected ? 0x60a5fa : this.isAffordable ? 0xfbbf24 : 0x444466;
    const borderAlpha = selected ? 1 : this.isAffordable ? 0.7 : 0.3;
    const borderWidth = selected ? 3 : 2;
    this.bg.lineStyle(borderWidth, borderColor, borderAlpha);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Inner border (subtle)
    if (this.isAffordable) {
      this.bg.lineStyle(1, 0xfbbf24, 0.15);
      this.bg.strokeRoundedRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 9);
    }

    // Unaffordable overlay
    if (!this.isAffordable) {
      this.bg.fillStyle(0x000000, 0.35);
      this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
  }

  setSelected(selected: boolean) {
    if (selected === this.isSelected) return;
    this.isSelected = selected;
    this.drawCard(selected);
    // Pop animation + sparkle
    if (selected) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.12,
        scaleY: 1.12,
        y: this.y - 8,
        duration: 100,
        ease: 'Back.easeOut',
      });

      // Selection sparkles
      for (let i = 0; i < 5; i++) {
        const sparkle = this.scene.add.circle(
          this.x + Phaser.Math.Between(-30, 30),
          this.y + Phaser.Math.Between(-35, 25),
          Phaser.Math.Between(1, 3),
          i % 2 === 0 ? 0xfbbf24 : 0xffffff,
          0.8,
        ).setDepth(65);
        this.scene.tweens.add({
          targets: sparkle,
          y: sparkle.y - 15,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 300 + Math.random() * 200,
          onComplete: () => sparkle.destroy(),
        });
      }
    } else {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        y: (this as any)._baseY || this.y,
        duration: 100,
      });
    }
  }

  setAffordable(affordable: boolean) {
    this.isAffordable = affordable;
    this.drawCard(this.isSelected);
    this.setAlpha(affordable ? 1 : 0.5);
  }

  updateCard(card: CardDef, index: number) {
    this.cardDef = card;
    this.index = index;
    this.nameText.setText(card.name);
    this.costText.setText(`${card.cost}`);
    this.isSelected = false;
    this.drawCard(false);
  }
}
