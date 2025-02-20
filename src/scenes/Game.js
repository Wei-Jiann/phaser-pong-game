import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.leftpaddle = null;
        this.rightpaddle = null;
        this.ballMotion = false;
        this.wasd = null;
        this.curser = null;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background').setScale(0.8, 0.8);

        this.ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        this.leftPaddle = this.add.image(50, 384, "paddle");
        this.rightPaddle = this.add.image(974, 384, "paddle");

        this.input.keyboard.on('keydown-SPACE', this.startBall, this);

        this.curser = this.keyboard.createCursorKeys();
        this.wasd = this.imput.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S
        });
    }

    update() {
    }
    
    startBall() {
        if (!this.ballMotion) {
            let initionalVelocityX = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            let initionalVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(initionalVelocityX, initionalVelocityY);
            this.ballMotion = true;
        }
    }
}