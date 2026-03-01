import Phaser from 'phaser';

export class FloatingText {
  static show(scene: Phaser.Scene, x: number, y: number, text: string, color: string = '#ffffff', size: number = 14) {
    const txt = scene.add.text(x, y, text, {
      fontSize: `${size}px`,
      color,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(100);

    scene.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => txt.destroy(),
    });
  }

  static showAnnouncement(scene: Phaser.Scene, text: string) {
    const txt = scene.add.text(215, 200, text, {
      fontSize: '16px',
      color: '#ff4444',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: 380 },
    }).setOrigin(0.5).setDepth(100);

    scene.tweens.add({
      targets: txt,
      alpha: 0,
      duration: 3000,
      delay: 1500,
      ease: 'Power1',
      onComplete: () => txt.destroy(),
    });
  }
}
