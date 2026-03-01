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

  static readonly W = 74;
  static readonly H = 90;

  constructor(scene: Phaser.Scene, x: number, y: number, card: CardDef, index: number) {
    super(scene, x, y);
    this.cardDef = card;
    this.index = index;

    // Card background
    this.bg = scene.add.graphics();
    this.drawCard(false);
    this.add(this.bg);

    // Unit icon or spell symbol
    if (card.type === 'unit' && scene.textures.exists(card.texture)) {
      this.icon = scene.add.sprite(0, -6, card.texture).setScale(1.2);
      this.add(this.icon);
    } else {
      const symbols: Record<string, string> = {
        heal: '\u2764',    // heart
        push: '\u21c4',    // arrows
        overclock: '\u26a1', // lightning
      };
      const sym = scene.add.text(0, -10, symbols[card.spellEffect || ''] || '?', {
        fontSize: '22px',
        color: `#${card.color.toString(16).padStart(6, '0')}`,
      }).setOrigin(0.5);
      this.icon = sym;
      this.add(sym);
    }

    // Name
    this.nameText = scene.add.text(0, 24, card.name, {
      fontSize: '9px',
      color: '#e2e8f0',
      fontFamily: '"Trebuchet MS", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Cost badge (purple elixir drop)
    this.costBadge = scene.add.graphics();
    this.drawCostBadge();
    this.add(this.costBadge);

    this.costText = scene.add.text(-27, -38, `${card.cost}`, {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.add(this.costText);

    this.setSize(CardSprite.W, CardSprite.H);
    this.setInteractive();
    this.setDepth(60);
    scene.add.existing(this);
  }

  private drawCostBadge() {
    this.costBadge.clear();
    // Purple elixir drop shape
    this.costBadge.fillStyle(0x9333ea);
    this.costBadge.fillCircle(-27, -36, 11);
    this.costBadge.lineStyle(1.5, 0xfbbf24, 0.8);
    this.costBadge.strokeCircle(-27, -36, 11);
    // Inner highlight
    this.costBadge.fillStyle(0xa855f7, 0.5);
    this.costBadge.fillCircle(-29, -38, 4);
  }

  private drawCard(selected: boolean) {
    this.bg.clear();
    const w = CardSprite.W, h = CardSprite.H;

    // Shadow
    this.bg.fillStyle(0x000000, 0.5);
    this.bg.fillRoundedRect(-w / 2 + 2, -h / 2 + 3, w, h, 10);

    // Main body
    if (!this.isAffordable) {
      this.bg.fillStyle(0x1a1828, 0.9);
    } else if (selected) {
      this.bg.fillStyle(0x3b3870);
    } else {
      this.bg.fillStyle(0x2d2a4a);
    }
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Inner panel
    this.bg.fillStyle(selected ? 0x4a4680 : this.isAffordable ? 0x3d3a5a : 0x222238);
    this.bg.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 8);

    // Top highlight
    this.bg.fillStyle(0xffffff, selected ? 0.1 : 0.05);
    this.bg.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h / 3, { tl: 7, tr: 7, bl: 0, br: 0 });

    // Border
    const borderColor = selected ? 0x60a5fa : this.isAffordable ? 0xfbbf24 : 0x444466;
    const borderAlpha = selected ? 1 : this.isAffordable ? 0.6 : 0.3;
    this.bg.lineStyle(selected ? 2.5 : 2, borderColor, borderAlpha);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Bottom color band (card type indicator)
    if (this.cardDef) {
      this.bg.fillStyle(this.cardDef.color, 0.3);
      this.bg.fillRoundedRect(-w / 2 + 4, h / 2 - 18, w - 8, 14, { tl: 0, tr: 0, bl: 7, br: 7 });
    }
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
    this.drawCard(selected);
    // Pop animation
    if (selected) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.12,
        scaleY: 1.12,
        y: this.y - 8,
        duration: 100,
        ease: 'Back.easeOut',
      });
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
