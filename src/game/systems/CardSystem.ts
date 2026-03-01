import { CARD_DEFS, CardDef } from '../config/cards';
import { HAND_SIZE, DECK_SIZE } from '../config/constants';

export class CardSystem {
  deck: CardDef[] = [];
  hand: CardDef[] = [];
  selectedCardIndex: number = -1;

  init() {
    // Shuffle all cards into deck
    this.deck = [...CARD_DEFS];
    this.shuffleDeck();
    this.hand = [];

    // Draw initial hand
    for (let i = 0; i < HAND_SIZE; i++) {
      this.drawCard();
    }
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  drawCard(): CardDef | null {
    if (this.hand.length >= HAND_SIZE) return null;
    if (this.deck.length === 0) {
      // Reshuffle: put all cards back except those in hand
      this.deck = CARD_DEFS.filter(c => !this.hand.find(h => h.id === c.id));
      this.shuffleDeck();
    }
    if (this.deck.length === 0) return null;
    const card = this.deck.shift()!;
    this.hand.push(card);
    return card;
  }

  playCard(index: number): CardDef | null {
    if (index < 0 || index >= this.hand.length) return null;
    const card = this.hand.splice(index, 1)[0];
    this.selectedCardIndex = -1;

    // Draw replacement
    this.drawCard();

    return card;
  }

  selectCard(index: number) {
    if (index === this.selectedCardIndex) {
      this.selectedCardIndex = -1; // Deselect
    } else {
      this.selectedCardIndex = index;
    }
  }

  getSelectedCard(): CardDef | null {
    if (this.selectedCardIndex < 0 || this.selectedCardIndex >= this.hand.length) return null;
    return this.hand[this.selectedCardIndex];
  }
}
