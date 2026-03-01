import * as Phaser from 'phaser';

export class FloatingText {
  static show(scene: Phaser.Scene, x: number, y: number, text: string, color: string = '#ffffff', size: number = 16) {
    // Shadow
    const shadow = scene.add.text(x + 1, y + 1, text, {
      fontSize: `${size}px`,
      color: '#000000',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(100).setAlpha(0.6);

    const txt = scene.add.text(x, y, text, {
      fontSize: `${size}px`,
      color,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(101);

    // Pop in
    txt.setScale(0.3);
    shadow.setScale(0.3);

    scene.tweens.add({
      targets: [txt, shadow],
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: [txt, shadow],
          y: y - 50,
          scaleX: 0.8,
          scaleY: 0.8,
          alpha: 0,
          duration: 700,
          ease: 'Power2',
          onComplete: () => {
            txt.destroy();
            shadow.destroy();
          },
        });
      },
    });
  }

  static showAnnouncement(scene: Phaser.Scene, text: string) {
    // Dark banner behind text
    const bannerW = 350;
    const bannerH = 40;
    const bx = 215 - bannerW / 2;
    const by = 195;

    const banner = scene.add.graphics().setDepth(99);
    banner.fillStyle(0x000000, 0.7);
    banner.fillRoundedRect(bx, by, bannerW, bannerH, 8);
    banner.lineStyle(2, 0xef4444, 0.6);
    banner.strokeRoundedRect(bx, by, bannerW, bannerH, 8);

    const txt = scene.add.text(215, by + bannerH / 2, text, {
      fontSize: '15px',
      color: '#ff6b6b',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: bannerW - 20 },
    }).setOrigin(0.5).setDepth(100);

    // Slide in from left
    banner.setAlpha(0);
    txt.setAlpha(0);
    banner.x = -50;
    txt.x = 215 - 50;

    scene.tweens.add({
      targets: [banner],
      x: 0,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
    });
    scene.tweens.add({
      targets: [txt],
      x: 215,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
    });

    // Fade out
    scene.tweens.add({
      targets: [txt, banner],
      alpha: 0,
      duration: 500,
      delay: 2500,
      ease: 'Power1',
      onComplete: () => {
        txt.destroy();
        banner.destroy();
      },
    });
  }

  static showBigText(scene: Phaser.Scene, text: string, color: string = '#fbbf24') {
    const txt = scene.add.text(215, 300, text, {
      fontSize: '36px',
      color,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    }).setOrigin(0.5).setDepth(110);

    txt.setScale(0.5);
    scene.tweens.add({
      targets: txt,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: txt,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          onComplete: () => {
            scene.tweens.add({
              targets: txt,
              alpha: 0,
              y: 280,
              duration: 1000,
              delay: 1000,
              ease: 'Power2',
              onComplete: () => txt.destroy(),
            });
          },
        });
      },
    });
  }
}
