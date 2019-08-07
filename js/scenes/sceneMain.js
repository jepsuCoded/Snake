class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  
  preload() {
    // Global Variable _scene
    _scene = this;
    this.timeSleep = {
      value: 0,
      max: 80
    };
  }
  
  create() {
    this.createSnake();
    this.text = this.add.text(game.cW, game.h*0.75, 'Hello').setOrigin(0.5, 0.5)
  
    this.ui = new GenUI({scene: this});
    this.nextGen = this.ui.add.button('Next Generation', 0xffff00)(this.ui.grid.centerX, this.ui.grid.rows*0.95);
  
    this.nextGen.on('pointerup', this.nextGeneration.bind(this));
  }
  
  update(time) {
    if (time > this.timeSleep.value) {
      let testSubject = this.ai.snakes[0];
      this.timeSleep.value = time+this.timeSleep.max;
      //this.snake.goTo();
      //if (testSubject.obj.gameOver)
      
      this.ai.train();
    }
  }
  
  createSnake(brain) {
    this.stage = new Stage(this, {
      col: 50,
      row: 50
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
    /*
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
    */
    
    //this.snake.apple = this.apple;
    //this.apple.placeApple(this.snake);
    
    this.ai = new SnakeAI(100, this.stage, brain || {
      i: 9, h: 10, o: 3
    });
  }
  
  restartSnake(brain) {
    for (let obj in this.stage.ui) {
      this.stage.ui[obj].destroy();
    }
    for (let s in this.ai.snakes) {
      for (let body in this.ai.snakes[s].obj.body) {
        this.ai.snakes[s].obj.body[body].destroy();
      }
      this.ai.snakes[s].obj.apple.body.destroy();
    }
    for (let bound in this.stage.border) {
      this.stage.border[bound].destroy();
    }
    
    this.stage.bg.destroy();
    this.swipe.destroy();
    
    this.stage = undefined;
    this.ai.snakes = undefined;
    this.swipe = undefined;

    this.createSnake(brain);
  }
  
  nextGeneration() {
    let best = 0, bestIndex = 0;
    for (let s in this.ai.snakes) {
      let snake = this.ai.snakes[s].obj;
      let score = snake.fitness;
      if (best < score) {
        best = score;
        bestIndex = s;
      }
    }
    
    let picked = this.ai.snakes[bestIndex].brain;
    this.restartSnake(picked);
    //this.ai = new SnakeAI(10, this.apple, this.stage, picked);
  }
}