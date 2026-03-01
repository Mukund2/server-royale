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
    const W = 430;
    const bannerW = 380;
    const bannerH = 50;
    const bx = W / 2 - bannerW / 2;
    const by = 200;

    // Red warning flash at screen edges
    const edgeL = scene.add.graphics().setDepth(97);
    edgeL.fillStyle(0xef4444, 0.3);
    edgeL.fillRect(0, by - 30, 5, bannerH + 60);
    const edgeR = scene.add.graphics().setDepth(97);
    edgeR.fillStyle(0xef4444, 0.3);
    edgeR.fillRect(W - 5, by - 30, 5, bannerH + 60);

    // Banner background (speech bubble style)
    const banner = scene.add.graphics().setDepth(99);
    // Shadow
    banner.fillStyle(0x000000, 0.5);
    banner.fillRoundedRect(bx + 3, by + 3, bannerW, bannerH, 10);
    // Dark red bg
    banner.fillStyle(0x3b0000, 0.9);
    banner.fillRoundedRect(bx, by, bannerW, bannerH, 10);
    // Top highlight
    banner.fillStyle(0x7f1d1d, 0.6);
    banner.fillRoundedRect(bx + 2, by + 2, bannerW - 4, bannerH / 2, { tl: 8, tr: 8, bl: 0, br: 0 });
    // Red border
    banner.lineStyle(2.5, 0xef4444, 0.8);
    banner.strokeRoundedRect(bx, by, bannerW, bannerH, 10);

    // Warning icon (left)
    banner.fillStyle(0xef4444);
    banner.fillTriangle(bx + 20, by + 12, bx + 12, by + 28, bx + 28, by + 28);
    banner.fillStyle(0x000000);
    banner.fillRect(bx + 19, by + 18, 2, 6);
    banner.fillCircle(bx + 20, by + 26, 1.5);

    const txt = scene.add.text(W / 2 + 8, by + bannerH / 2, text, {
      fontSize: '16px',
      color: '#ff6b6b',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: bannerW - 50 },
    }).setOrigin(0.5).setDepth(100);

    // Slam in from right
    banner.setAlpha(0);
    txt.setAlpha(0);
    banner.x = 60;
    txt.x = W / 2 + 68;

    scene.tweens.add({
      targets: [banner],
      x: 0,
      alpha: 1,
      duration: 250,
      ease: 'Back.easeOut',
    });
    scene.tweens.add({
      targets: [txt],
      x: W / 2 + 8,
      alpha: 1,
      duration: 250,
      ease: 'Back.easeOut',
    });

    // Fade out
    scene.tweens.add({
      targets: [txt, banner, edgeL, edgeR],
      alpha: 0,
      duration: 400,
      delay: 2800,
      ease: 'Power1',
      onComplete: () => {
        txt.destroy();
        banner.destroy();
        edgeL.destroy();
        edgeR.destroy();
      },
    });
  }

  static showBigText(scene: Phaser.Scene, text: string, color: string = '#fbbf24') {
    const W = 430;

    // Dark overlay flash
    const overlay = scene.add.graphics().setDepth(105);
    overlay.fillStyle(0x000000, 0.4);
    overlay.fillRect(0, 240, W, 120);
    // Gold trim lines
    overlay.fillStyle(parseInt(color.replace('#', ''), 16), 0.4);
    overlay.fillRect(0, 240, W, 2);
    overlay.fillRect(0, 358, W, 2);

    // Shadow text
    const shadow = scene.add.text(W / 2 + 2, 302, text, {
      fontSize: '42px',
      color: '#000000',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(109).setAlpha(0.6);

    // Main text
    const txt = scene.add.text(W / 2, 300, text, {
      fontSize: '42px',
      color,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
    }).setOrigin(0.5).setDepth(110);

    // Slam from top
    txt.setScale(0.3);
    txt.y = 250;
    shadow.setScale(0.3);
    shadow.y = 252;

    scene.tweens.add({
      targets: [txt, shadow],
      scaleX: 1.15,
      scaleY: 1.15,
      y: txt === txt ? 300 : 302,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Camera shake on impact
        scene.cameras.main.shake(150, 0.006);

        scene.tweens.add({
          targets: [txt, shadow],
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          onComplete: () => {
            scene.tweens.add({
              targets: [txt, shadow, overlay],
              alpha: 0,
              y: 280,
              duration: 800,
              delay: 1200,
              ease: 'Power2',
              onComplete: () => {
                txt.destroy();
                shadow.destroy();
                overlay.destroy();
              },
            });
          },
        });
      },
    });
  }

  static showDamageNumber(scene: Phaser.Scene, x: number, y: number, damage: number, isCrit: boolean = false) {
    const color = isCrit ? '#ffdd22' : '#ff6b6b';
    const size = isCrit ? 18 : 14;
    const txt = scene.add.text(x, y, `-${Math.round(damage)}`, {
      fontSize: `${size}px`,
      color,
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(90);

    txt.setScale(0.5);
    scene.tweens.add({
      targets: txt,
      scaleX: isCrit ? 1.3 : 1,
      scaleY: isCrit ? 1.3 : 1,
      duration: 80,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: txt,
          y: y - 30,
          alpha: 0,
          scaleX: 0.6,
          scaleY: 0.6,
          duration: 600,
          ease: 'Power2',
          onComplete: () => txt.destroy(),
        });
      },
    });
  }
}
