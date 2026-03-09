class Load extends Phaser.Scene {
    constructor () {
        super('loadScene')
    }

    preload () {
        // load sprites
        this.load.path = './assets/sprites/'
        this.load.image('bear', 'gummy-bear.png')
        this.load.image('bag', 'gummy-bear-bag.png')
    }

    create () {
        //this.add.rectangle(w/2, h/2, 300, 400, 0xff0000)
    }
}