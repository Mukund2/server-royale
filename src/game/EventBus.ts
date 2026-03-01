import * as Phaser from 'phaser';

// Shared event emitter for React <-> Phaser communication
export const EventBus = new Phaser.Events.EventEmitter();
