import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.leftPaddle = null;
        this.rightPaddle = null;
        this.ballMotion = false;
        this.wasd = null;
        this.curser = null;
        this.leftScore = 0;
        this.leftScoreText = null;
        this.rightScore = 0;
        this.rightScoreText = null;
        this.paddleSpeed = 5;
        this.trajectoryLine = null;
        this.leftwin = null;
        this.rightwin = null;
        this.leftwincon = false;
        this.rightwincon = false;
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

        this.leftPaddle = this.physics.add.image(50, 384, "paddle");
        this.leftPaddle.setImmovable(true);
        this.rightPaddle = this.physics.add.image(974, 384, "paddle");
        this.rightPaddle.setImmovable(true);

        this.physics.add.collider(this.ball, this.leftPaddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.hitPaddle, null, this);

        this.input.keyboard.on('keydown-SPACE', this.startBall, this);

        this.cursers = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S 
        });

        this.leftScoreText = this.add.text(100, 50, '0', { fontSize: '50px' });
        this.rightScoreText = this.add.text(924, 50, '0', { fontSize: '50px' });

        // Create the graphics object for the trajectory line
        this.trajectoryLine = this.add.graphics();

        // Create the win text
        this.leftWin = this.add.text(WIDTH / 2, HEIGHT / 2, 'Left Wins!', { fontSize: '50px' }).setOrigin(0.5, 0.5);
        this.leftWin.visible = false;
        
        this.rightWin = this.add.text(WIDTH / 2, HEIGHT / 2, 'Right Wins!', { fontSize: '50px' }).setOrigin(0.5, 0.5);
        this.rightWin.visible = false;
    }

    update() {
        if (this.leftwincon || this.rightwincon){
            this.trajectoryLine.clear();
            return;
        }
        if (this.cursers.up.isDown && this.rightPaddle.y > 0) {
            this.rightPaddle.y -= this.paddleSpeed;
        } else if (this.cursers.down.isDown && this.rightPaddle.y < HEIGHT) {
            this.rightPaddle.y += this.paddleSpeed;
        }
        if (this.wasd.up.isDown && this.leftPaddle.y > 0) {
            this.leftPaddle.y -= this.paddleSpeed;
        } else if (this.wasd.down.isDown && this.leftPaddle.y < HEIGHT) {
            this.leftPaddle.y += this.paddleSpeed;
        }

        const margin = 30;
        if (this.ball.x < margin) {
            this.rightScore += 1;
            this.rightScoreText.setText(this.rightScore);
            this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
            this.checkWinCon();
            this.resetBall();
        } else if (this.ball.x > WIDTH - margin) {
            this.leftScore += 1;
            this.leftScoreText.setText(this.leftScore);
            this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
            this.checkWinCon();
            this.resetBall();
        }

        // Draw the trajectory line
        this.drawTrajectory();
    }
    
    startBall() {
        if (!this.ballMotion) {
            let initionalVelocityX = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            let initionalVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(initionalVelocityX, initionalVelocityY);
            this.ballMotion = true;
        }
    }

    resetBall() {
        this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
        this.ball.setVelocity(0, 0);
        this.ballMotion = false;
        this.startBall();

        this.paddleSpeed = 5;
    }

    hitPaddle(ball, paddle) {
        let velocityFactor = 1.2;
        let newVelocityX = ball.body.velocity.x * velocityFactor;
        let newVelocityY = ball.body.velocity.y * velocityFactor;

        ball.setVelocity(newVelocityX, newVelocityY);

        this.paddleSpeed += 1.5;
    }

    drawTrajectory() {
        // Clear previous trajectory line
        this.trajectoryLine.clear();
    
        // Set line style
        this.trajectoryLine.lineStyle(2, 0xff0000, 1);
    
        // Calculate the trajectory
        let ballVelocity = this.ball.body.velocity.clone();
        let ballPosition = this.ball.body.position.clone();
        let predictedPosition = new Phaser.Math.Vector2(ballPosition.x, ballPosition.y);
    
        // Get the ball's radius
        let ballRadius = (this.ball.displayWidth / 2);
    
        // Draw the trajectory line
        this.trajectoryLine.beginPath();
        this.trajectoryLine.moveTo(ballPosition.x, ballPosition.y);
    
        // Predict the position of the ball for the next 25 frames
        for (let i = 0; i < 50; i++) {
            predictedPosition.x += ballVelocity.x * 0.020;
            predictedPosition.y += ballVelocity.y * 0.020;
    
            // Check for collisions with the world bounds
            if (predictedPosition.x - ballRadius <= 0) {
                predictedPosition.x = ballRadius;
                ballVelocity.x *= -1;
            } else if (predictedPosition.x + ballRadius >= WIDTH) {
                predictedPosition.x = WIDTH - ballRadius;
                ballVelocity.x *= -1;
            }
    
            if (predictedPosition.y - ballRadius <= 0) {
                predictedPosition.y = ballRadius;
                ballVelocity.y *= -1;
            } else if (predictedPosition.y + ballRadius >= HEIGHT) {
                predictedPosition.y = HEIGHT - ballRadius;
                ballVelocity.y *= -1;
            }
    
            this.trajectoryLine.lineTo(predictedPosition.x, predictedPosition.y);
        }
    
        this.trajectoryLine.strokePath();
    }
    checkWinCon (){
        if (this.leftScore == 1){
            this.leftwincon = true;
            this.leftWin.visible = true;
            this.ballMotion = false;
            this.ball.visible = false;
        }
        if (this.rightScore == 1){
            this.rightwincon = true;
            this.rightWin.visible = true;
            this.ballMotion = false
            this.ball.visible = false;
        }
    }

}