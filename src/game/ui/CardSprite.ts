import * as Phaser from 'phaser';
import { CardDef } from '../config/cards';

export class CardSprite extends Phaser.GameObjects.Container {
  cardDef: CardDef;
  index: number;
  bg: Phaser.GameObjects.Graphics;
  nameText: Phaser.GameObjects.Text;
  costText: Phaser.GameObjects.Text;
  icon: Phaser.GameObjects.Sprite | null = null;
  isSelected: boolean = false;
  isAffordable: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, card: CardDef, index: number) {
    super(scene, x, y);
    this.cardDef = card;
    this.index = index;

    // Card background
    this.bg = scene.add.graphics();
    this.drawCard(false);
    this.add(this.bg);

    // Icon (unit texture or spell icon)
    if (card.type === 'unit' && scene.textures.exists(card.texture)) {
      this.icon = scene.add.sprite(0, -10, card.texture);
      this.add(this.icon);
    } else {
      // Spell indicator
      const spellIcon = scene.add.text(0, -12, card.spellEffect === 'heal' ? '+' : card.spellEffect === 'push' ? '>' : '!', {
        fontSize: '20px',
        color: `#${card.color.toString(16).padStart(6, '0')}`,
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(spellIcon);
    }

    // Name
    this.nameText = scene.add.text(0, 18, card.name, {
      fontSize: '9px',
      color: '#cccccc',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Cost (top-left badge)
    this.costText = scene.add.text(-28, -38, `${card.cost}`, {
      fontSize: '14px',
      color: '#bb88ff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(this.costText);

    this.setSize(70, 90);
    this.setInteractive();
    this.setDepth(60);
    scene.add.existing(this);
  }

  private drawCard(selected: boolean) {
    this.bg.clear();
    const w = 70, h = 90;

    if (!this.isAffordable) {
      this.bg.fillStyle(0x111122, 0.8);
    } else {
      this.bg.fillStyle(selected ? 0x2a2a5e : 0x1a1a3e);
    }
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);

    this.bg.lineStyle(2, selected ? 0x88aaff : this.isAffordable ? 0x4444aa : 0x333355);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
    this.drawCard(selected);
    this.setScale(selected ? 1.1 : 1);
  }

  setAffordable(affordable: boolean) {
    this.isAffordable = affordable;
    this.drawCard(this.isSelected);
    this.setAlpha(affordable ? 1 : 0.6);
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
