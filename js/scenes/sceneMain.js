class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  
  preload() {
    // Global Variable _scene
    _scene = this;
    this.timeSleep = {
      value: 0,
      max: 400
    };
  }
  
  create() {
    this.createSnake();
  }
  
  update(time) {
    if (time > this.timeSleep.value) {
      this.timeSleep.value = time+this.snake.speed;
      this.snake.goTo();
    }
  }
  
  createSnake() {
    this.stage = new Stage(this, {
      col: 30,
      row: 30
    }, {
      border: 0x38607c,
      bg: 0xfff8c0
    });
    
    this.swipe = this.rexGestures.add.swipe(this, {
      direction: '4dir',
    });
    
    this.swipe.on('swipe', swipe => {
      if (this.snake.gameOver) {
        this.restartSnake();
        return;
      }
      
      if (swipe.up) {
        this.snake.dir(0);
        return;
      }
      if (swipe.right) {
        this.snake.dir(1);
        return;
      }
      if (swipe.down) {
        this.snake.dir(2);
        return;
      }
      if (swipe.left) {
        this.snake.dir(3);
        return;
      }
    });
    
    this.snake = new Snake({
      color: {
        head: 0x55a894,
        body: 0x5c7a56,
        tail: 0x3e5442,
        outline: 0xfff8c0,
      },
      stage: this.stage,
      //pos: {x: 2, y: 2},
      direction: 1,
      speed: 80,
      length: 3
    });
    
    this.apple = new Apple(this.stage, {
      size: 1
    });
    this.snake.apple = this.apple;
    this.apple.placeApple(this.snake);
  }
  
  restartSnake() {
    for (let obj in this.stage.ui) {
      this.stage.ui[obj].destroy();
    }
    for (let body in this.snake.body) {
      this.snake.body[body].destroy();
    }
    for (let bound in this.stage.border) {
      this.stage.border[bound].destroy();
    }
    
    this.stage.bg.destroy();
    this.apple.body.destroy();
    this.swipe.destroy();
    
    this.stage = undefined;
    this.snake = undefined;
    this.apple = undefined;
    this.swipe = undefined;

    this.createSnake();
  }
}