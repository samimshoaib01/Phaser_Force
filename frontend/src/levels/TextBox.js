export default class TextBox {
    constructor(scene, x, y, width, height, pages, onComplete) {
        this.scene = scene;
        this.pages = pages;
        this.currentPage = 0;
        this.onComplete = onComplete;

        // Create dialog box, text, and next-page icon
        this.dialogBox = scene.rexUI.add.roundRectangle(x, y, width, height, 20, 0x000000, 0.8)
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(2, 0xffffff)
            .setAlpha(0);  // Initially hidden

        this.text = scene.add.text(x - width / 2 + 20, y - height / 2 + 10, '', {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#ffffff',
            wordWrap: { width: width - 40 },
            resolution: 2
        }).setOrigin(0).setAlpha(0);  // Initially hidden

        this.nextPageIcon = scene.add.image(x + width / 2 - 20, y + height / 2 - 20, 'nextPage')
            .setOrigin(1)
            .setScale(0.5)
            .setVisible(false)
            .setAlpha(0);  // Initially hidden

        this.dialogBox.setInteractive();
        this.dialogBox.on('pointerdown', () => this.nextPage());
    }

    showPage() {
        // Clear any previous events to avoid overlap
        if (this.typingEvent) this.typingEvent.remove();

        const fullText = this.pages[this.currentPage];
        this.text.setText('');
        this.nextPageIcon.setVisible(false);

        let charIndex = 0;

        // Typewriter effect
        this.typingEvent = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (charIndex < fullText.length) {
                    this.text.setText(fullText.substring(0, charIndex + 1));
                    charIndex++;
                } else {
                    // Display next-page icon after typing completes
                    this.nextPageIcon.setVisible(this.currentPage < this.pages.length - 1);
                }
            },
            repeat: fullText.length - 1
        });
    }

    nextPage() {
        if (this.currentPage < this.pages.length - 1) {
            this.currentPage++;
            this.showPage();
        } else {
            this.hide();
            if (this.onComplete) this.onComplete();  // Trigger the onComplete callback
        }
    }

    start() {
        // Reset text box elements to be visible with fade-in effect
        this.scene.tweens.add({
            targets: [this.dialogBox, this.text, this.nextPageIcon],
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Start the first page after fade-in completes
                this.showPage();
            }
        });
    }

    hide() {
        // Fade out the dialog box elements smoothly
        this.scene.tweens.add({
            targets: [this.dialogBox, this.text, this.nextPageIcon],
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.dialogBox.setVisible(false);
                this.text.setVisible(false);
                this.nextPageIcon.setVisible(false);
            }
        });
    }
}
