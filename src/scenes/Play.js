class Play extends Phaser.Scene {
    constructor () {
        super('playScene')
    }

    init () {
        // min and max velocity values
        this.MIN_VEL = 200
        this.MAX_VEL = 300
        
        // origin point coordinates to spawn gummy bears
        this.bearsOriginX = w / 2
        this.bearsOriginY = h / 2

        // integer index for playing random plastic sfx
        this.plasticIndex = 1

        // min and max numbers of gummy bears to be spawned
        this.MIN_BEARS = 10
        this.MAX_BEARS = 20
        // integer index for spawning bears on the screen
        this.bearsIndex = this.MIN_BEARS
        this.remainingBears = this.bearsIndex
    }

    create () {
        // plays idle music on loop
        this.idle = this.sound.add('idle_bgm') 
        this.idle.play({ loop: true, })

        // plays funky music during gummy bear spawns
        this.funky = this.sound.add('funky_bgm')

        // explosion sound effect for when bag 'pops'
        this.explosion = this.sound.add('explosion')

        this.bag = this.createBag()     // adds gummy bear game object with physics
        this.bag.setInteractive({ draggable: true, useHandCursor: true, pixelPerfect: true },)  // passed to Input Manager to allow dragging
        this.bag.on('drag', (pointer, dragX, dragY) => this.bag.setPosition(dragX, dragY))      // moves the bag when you click and drag with mouse

        // group to hold all gummy bears spawned
        this.bears = this.add.group()

        // timer event config for bag pop and spawning gummy bears
        /*
        *   MOST GAME STATE TRANSITIONS HAPPEN HERE!
        */
        let bagPopConfig = { delay: 3000, callback: () => {
            //console.log('POP')
            //console.log(bag.x, bag.y)
            this.bagPop()
            this.jukebox()
            this.spawnBears()
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
            this.plasticNoises.paused = false
        }, this)
        // pause timers if released early
        this.bag.on('dragend', () => {
            this.bagPopDelay.paused = true
            this.plasticNoises.paused = true
        }, this)

        // key to toggle physics debugger
        this.keyDebug = this.input.keyboard.addKey('D')
    }

    update () {
        /*
        if (Phaser.Input.Keyboard.JustDown(this.keyDebug)) {
            if (this.bag.debugShowBody) {
                this.bag.debugShowBody = false
                console.log('debug mode: off')
            }
            else {
                this.bag.debugShowBody = true
                console.log('debug mode: on')
            }
        }
        */
    }

    // create new bag object at the start of the game
    createBag () {
        let bag = this.physics.add.sprite(w/2, h/2, 'bag').setScale(0.75).setOrigin(0.5)
        bag.body.setCollideWorldBounds(true)   // prevents player from dragging out of game window
        bag.body.setSize(bag.width - bag.width / 8, bag.height - bag.height / 12)  // adjusted the physics body to fit the sprite better
        return bag
    }

    // updates game state after the bag 'pops'
    bagPop () {
        //this.bag.alpha = 0
        this.plasticNoises.paused = true    // stop bag crinkle sfx

        // save x, y bag postion to the new bears spawning origin point
        this.bearsOriginX = this.bag.x
        this.bearsOriginY = this.bag.y

        this.bag.destroy()      // removes bag from scene
        console.log('got that bag')
    }

    // plays a random plastic sound while shaking the bag
    playCrinkle () {
        this.plasticIndex = Phaser.Math.Between(1, 5)   // chooses random index
        this.sound.play('plastic' + this.plasticIndex, { detune: 50 })  // plays random crinkle sound
    }

    // plays a random pop sound after clicking each gummy bear
    playPop () {
        let popIndex = Phaser.Math.Between(1, 3)            // chooses random index
        this.sound.play('pop' + popIndex, { detune: 50, })  // plays random pop sound
    }

    // for switching music after bag pop
    jukebox () {
        this.idle.stop()                                            // stop playing idle music
        this.explosion.play({ volume: 0.5, })                       // play quick explosion sound effect
        this.funky.play({ delay: 0.5, loop: true, volume: 0.5, })   // start playing funky music after delay
    }

    // SECOND GAME STATE
    // spawns all gummy bears
    spawnBears () {
        this.bearsIndex = Phaser.Math.Between(this.MIN_BEARS, this.MAX_BEARS)
        this.remainingBears = this.bearsIndex
        console.log(`total bears: '${this.remainingBears}'`)

        // creates the number of gummy bears in 'this.bearsIndex'
        for (let i = 0; i < this.bearsIndex; i++) {
            let bearX = this.bearsOriginX
            let bearY = this.bearsOriginY

            // randomly choose positive/negative velocity for each bear
            let velXDirection = Math.round(Math.random()) ? 1 : -1
            let velYDirection = Math.round(Math.random()) ? 1 : -1

            console.log(`bear #'${i}'`)
            // creates physics object
            let newBear = this.physics.add.sprite(bearX, bearY, this.color())
            // adds to 'bears' group
            this.bears.add(newBear)

            newBear.setScale(1.5)
            //newBear.setAlpha(0.5)
            // gummy bears bounce off of world bounds
            newBear.body.setCollideWorldBounds()
            newBear.body.setBounce(1)
            // sets velocity of each bear
            newBear.body.setVelocityX(Phaser.Math.Between(this.MIN_VEL, this.MAX_VEL) * velXDirection)
            newBear.body.setVelocityY(Phaser.Math.Between(this.MIN_VEL, this.MAX_VEL) * velYDirection)

            // makes each gummy bear clickable
            newBear.setInteractive({
                useHandCursor: true,
                pixelPerfect: true,
            })

            newBear.on('pointerdown', this.bearPop)
        }
    }

    // picks a random color from an array
    color () {
        let colorWheel = ['bearR', 'bearO', 'bearY', 'bearG', 'bearB', 'bearP']
        let colorPick = Phaser.Math.Between(0, colorWheel.length - 1)
        //console.log(`color: '${colorWheel[colorPick]}'`)
        return colorWheel[colorPick]
    }

    // removes clicked object
    // based on Nathan Altice's code:
    // https://github.com/nathanaltice/CleanPop/blob/master/src/main.js (line 98)
    bearPop (pointer, localX, localY, event) {
        let sceneContext = this.scene   // saves scene context before we delete anything
        sceneContext.playPop()          // plays pop sound
        this.destroy()                  // destory child object
        sceneContext.remainingBears--   // lower total bears counter

        if (!sceneContext.remainingBears) {
            console.log('done')
        }
    }
}