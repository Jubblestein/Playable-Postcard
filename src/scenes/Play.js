class Play extends Phaser.Scene {
    constructor () {
        super('playScene')
    }

    create () {
        this.add.image(w/2, h/2, 'bear')
    }
}