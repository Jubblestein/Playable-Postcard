// Justin Fogo
// Playable Postcard project -- "Sweet Things"
// CMPM 120 final project that will be sent to my mom once finished
// Created: 3/9/2026

'use strict'

const config = {
    parent: 'game',
    type: Phaser.AUTO,
    backgroundColor: 0xFFD1CC,
    width: 700,
    height: 600,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scene: [ Load, Play ],
}

const game = new Phaser.Game(config)

// width and height of the game canvas
const w = game.config.width
const h = game.config.height
