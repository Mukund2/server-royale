import * as Phaser from 'phaser';
import { CardSystem } from '../systems/CardSystem';
import { BudgetSystem } from '../systems/BudgetSystem';
import { CardSprite } from './CardSprite';
import { GAME_WIDTH } from '../config/constants';

export class CardHand {
  private scene: Phaser.Scene;
  private cardSprites: CardSprite[] = [];
  private cardSystem: CardSystem;
  private onCardSelected: (index: number) => void;

  constructor(
    scene: Phaser.Scene,
    cardSystem: CardSystem,
    onCardSelected: (index: number) => void
  ) {
    this.scene = scene;
    this.cardSystem = cardSystem;
    this.onCardSelected = onCardSelected;
  }

  create() {
    this.rebuildHand();
  }

  rebuildHand() {
    // Destroy old sprites
    for (const cs of this.cardSprites) {
      cs.destroy();
    }
    this.cardSprites = [];

    const hand = this.cardSystem.hand;
    const startX = (GAME_WIDTH - (hand.length * 80)) / 2 + 40;
    const y = 720;

    for (let i = 0; i < hand.length; i++) {
      const card = hand[i];
      const sprite = new CardSprite(this.scene, startX + i * 80, y, card, i);
      sprite.on('pointerdown', () => {
        this.onCardSelected(sprite.index);
      });
      this.cardSprites.push(sprite);
    }
  }

  update(budget: BudgetSystem) {
    const hand = this.cardSystem.hand;
    const selectedIndex = this.cardSystem.selectedCardIndex;

    // Ensure sprites match hand
    if (this.cardSprites.length !== hand.length) {
      this.rebuildHand();
    }

    for (let i = 0; i < this.cardSprites.length; i++) {
      const cs = this.cardSprites[i];
      if (i < hand.length) {
        if (cs.cardDef.id !== hand[i].id) {
          cs.updateCard(hand[i], i);
        }
        cs.setSelected(i === selectedIndex);
        cs.setAffordable(budget.canAfford(hand[i].cost));
      }
    }
  }
}
