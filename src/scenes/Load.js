class Load extends Phaser.Scene {
    constructor () {
        super('loadScene')
    }

    preload () {
        // load sprites
        this.load.path = './assets/sprites/'
        this.load.image('bear', 'gummy-bear.png')
        this.load.image('bag', 'gummy-bear-bag.png')

        // load audio
        this.load.path = './assets/audio/'
        this.load.audio('idle_bgm', 'two_left_socks.ogg')
        this.load.audio('funky_bgm', 'raspberry_jam.ogg')
        this.load.audio('chill_bgm', 'summers.mp3')
    }

    create () {
        //this.add.rectangle(w/2, h/2, 300, 400, 0xff0000)
    }
}