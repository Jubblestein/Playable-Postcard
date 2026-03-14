class Play extends Phaser.Scene {
    constructor () {
        super('playScene')
    }

    init () {
        this.bagShaking = false // update scene after bag pops

        // origin point coordinates to spawn gummy bears
        this.bearsOriginX = w / 2
        this.bearsOriginY = h / 2
    }

    create () {
        // plays idle music on loop
        let idle = this.sound.add('idle_bgm', { loop: true }) 
        idle.play()

        this.bag = this.createBag()                 // adds gummy bear game object with physics
        this.bag.body.setCollideWorldBounds(true)   // prevents player from dragging out of game window
        this.bag.body.setSize(this.bag.width - this.bag.width / 8, this.bag.height - this.bag.height / 12)  // adjusted the physics body to fit the sprite better

        this.bag.setInteractive({ draggable: true },)                                       // passed to Input Manager to allow dragging
        this.bag.on('drag', (pointer, dragX, dragY) => this.bag.setPosition(dragX, dragY))  // moves the bag when you click and drag with mouse

        // timer event config for bag pop and spawning gummy bears
        let bagPopConfig = { delay: 1000, callback: () => {
            //console.log('POP')
            //console.log(bag.x, bag.y)
            this.bag.alpha = 0
            this.bearsOriginX = this.bag.x
            this.bearsOriginY = this.bag.y
            this.bagShaking = true
        }, paused: true,}

        this.bagPopDelay = this.time.addEvent(bagPopConfig) // timer event to destroy bag after being held for 3s

        // after clicking & holding bag; unpause timer
        this.bag.on('pointerdown', () => {
            this.bagPopDelay.paused = false
        }, this)
        // pause timer if released early
        this.bag.on('pointerup', () => {
            this.bagPopDelay.paused = true
        }, this)
    }

    update () {
        if (this.bagShaking) {
            this.bagPop(this.bag)
            
            this.bagShaking = false
        }
    }

    createBag () {
        let bag = this.physics.add.sprite(w/2, h/2, 'bag').setScale(0.75).setOrigin(0.5)
        return bag
    }

    bagPop (bag) {
        bag.alpha = 0
        console.log('got that bag')
    }
}