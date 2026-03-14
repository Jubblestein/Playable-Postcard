class Play extends Phaser.Scene {
    constructor () {
        super('playScene')
    }

    create () {
        // plays idle music on loop
        let idle = this.sound.add('idle_bgm', { loop: true }) 
        idle.play()

        let bag = this.physics.add.sprite(w/2, h/2, 'bag').setScale(0.75).setOrigin(0.5)    // adds gummy bear game object with physics
        bag.setInteractive({ draggable: true },)                                            // passed to Input Manager to allow dragging
        bag.on('drag', (pointer, dragX, dragY) => bag.setPosition(dragX, dragY))            // moves the bag when you click and drag with mouse

        bag.body.setCollideWorldBounds(true)                                        // prevents player from dragging out of game window
        bag.body.setSize(bag.width - bag.width / 8, bag.height - bag.height / 12)   // adjusted the physics body to fit the sprite better
    }
}