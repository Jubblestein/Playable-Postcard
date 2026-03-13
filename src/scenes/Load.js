class Load extends Phaser.Scene {
    constructor () {
        super('loadScene')
    }

    preload () {
        // loading bar
        // https://github.com/nathanaltice/Paddle-Parkour-P360/blob/master/src/scenes/Load.js
        // line 9-17
        let loadingBar = this.add.graphics()
        this.load.on('progress', (value) => {
            loadingBar.clear()                      // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1)       // (color, alpha)
            loadingBar.fillRect(50, h/2, w*value - 100, 20) // (x, y, w, h)
        })
        this.load.on('complete', () => {
            loadingBar.destroy()
        })
        
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

        this.scene.start('playScene')
    }
}