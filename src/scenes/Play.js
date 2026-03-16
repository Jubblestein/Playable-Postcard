class Play extends Phaser.Scene {
    constructor () {
        super('playScene')
    }

    init () {
        this.bagShaking = false // update scene after bag pops

        // origin point coordinates to spawn gummy bears
        this.bearsOriginX = w / 2
        this.bearsOriginY = h / 2

        // integer index for playing random plastic sfx
        this.plasticIndex = 1
    }

    create () {
        // plays idle music on loop
        let idle = this.sound.add('idle_bgm', { loop: true }) 
        idle.play()

        this.bag = this.createBag()     // adds gummy bear game object with physics
        this.bag.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true },)  // passed to Input Manager to allow dragging
        this.bag.on('drag', (pointer, dragX, dragY) => this.bag.setPosition(dragX, dragY))      // moves the bag when you click and drag with mouse

        // timer event config for bag pop and spawning gummy bears
        let bagPopConfig = { delay: 3000, callback: () => {
            //console.log('POP')
            //console.log(bag.x, bag.y)
            this.bagPop(this.bag)
        }, paused: true}

        this.bagPopDelay = this.time.addEvent(bagPopConfig) // timer event to destroy bag after being held for 3s

        // timer event config for playing random plastic sfx
        let plasticNoisesConfig = { delay: 250, callback: () => {
            this.playCrinkle()
        }, paused: true, loop: true}

        this.plasticNoises = this.time.addEvent(plasticNoisesConfig) // plays random plastic bag sounds while shaking bag

        // after clicking & holding bag; unpause timers
        this.bag.on('drag', () => {
            this.bagPopDelay.paused = false
            this.bagShaking = true
            this.plasticNoises.paused = false
        }, this)
        // pause timers if released early
        this.bag.on('dragend', () => {
            this.bagPopDelay.paused = true
            this.bagShaking = false
            this.plasticNoises.paused = true
        }, this)

        this.keyDebug = this.input.keyboard.addKey('D')
    }

    update () {
        if (this.bagShaking) {
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyDebug)) {
            this.game.config.physics.arcade.debug.valueOf.apply(!this.game.config.physics.arcade.debug.valueOf)
        }
    }

    createBag () {
        let bag = this.physics.add.sprite(w/2, h/2, 'bag').setScale(0.75).setOrigin(0.5)
        bag.body.setCollideWorldBounds(true)   // prevents player from dragging out of game window
        bag.body.setSize(bag.width - bag.width / 8, bag.height - bag.height / 12)  // adjusted the physics body to fit the sprite better
        return bag
    }

    bagPop (bag) {
        bag.alpha = 0
        this.bearsOriginX = this.bag.x
        this.bearsOriginY = this.bag.y
        //this.bag.destroy()
        console.log('got that bag')
    }

    playCrinkle () {
        this.plasticIndex = Phaser.Math.Between(1, 5)
        this.sound.play('plastic' + this.plasticIndex, { detune: 50 })
    }
}