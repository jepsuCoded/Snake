class SnakeAI {
  constructor(snakeCount, stage, brain) {
    this.snakes = [];
    for (let j = 0; j < snakeCount; j++) {
      let data = {};
      
      data.obj = new Snake({
          color: {
            head: 0x55a894,
            body: 0x5c7a56,
            tail: 0x3e5442,
            outline: 0xfff8c0,
          },
          stage: stage,
          //pos: {x: 2, y: 2},
          speed: 80,
          length: 10
      });
      if (brain instanceof NeuralNetwork) {
        data.brain = brain.copy();
        data.brain.mutate(this.mutate);
      }
      else
        data.brain = new NeuralNetwork(brain.i, brain.h, brain.o);
      
      //data.obj.inputs = [];
      
      data.move = (input, dir) => {
        let here = input.indexOf(Math.max.apply(Math, input));
        data.obj.dir(dir[here]);
        data.obj.goTo();
      };
      
      data.obj.apple = new Apple(stage, {
        size: 1
      });
      
      data.obj.apple.placeApple(data.obj);
      
      this.snakes.push(new Object(data));
    }
    
    this.stage = stage;
    //this.apple = apple;
    this.training = true;
    
    this.excludeDirection = [2, 3, 0, 1];
    this.maxD = Phaser.Math.Distance.Between(0, 0, this.stage.col, this.stage.row);
  
    //this.train();
  }
  
  mutate(x) {
    if (Math.random() < 0.3) {
      let offset = Math.random()*1//randomG(2)//*0.5;
      let newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }
  
  train() {
    if (!this.training) return;
    
    for (let s in this.snakes) {
      let snake = this.snakes[s];
      if (snake.obj.gameOver) continue;
      let len = snake.obj.data.length;
      //let x = snake.obj.data[len-1].x;
      //let y = snake.obj.data[len-1].y;
      //let directions = {x: [], y: []};
      
      let allPos = this.stage.getSnakeData(snake.obj.data);
      
      let dir = snake.obj.direction;
      let dirs = [(dir+3)%4, dir, (dir+1)%4];
      
      let input = this.trainInput(allPos, snake.obj.data[len-1], dirs, snake.obj.apple.point);
        //_scene.text.setText(input);
        
      let output = snake.brain.predict(input);
      snake.move(output, dirs);
    }
  }
  
  trainInput(data, head, direction, point) {
    // distance to apple
    // distance of hit to left of snake
    // distance of hit to front of snake
    // distance of hit to right of snake
    // direction of head to apple, 4
    // current direction
    
    //if (head.x > 49) head.x = 49;
    
    let d = Phaser.Math.Distance.Between(head.x, head.y, point.x, point.y);
    let apple = 1-(d/this.maxD);
    let hit = [];
    let output = [apple];
    
    let dX = head.x-point.x;
    let dY = head.y-point.y;
    let top = 0, right = 0, bot = 0, left = 0;
    
    if (dX < 0) left = 1;
    else if (dX > 0) right = 1;
    
    if (dY < 0) bot = 1;
    else if (dX > 0) top = 1;
    
    for (let dir of direction) {
      let ind = hit.length;
      
      switch (dir) {
        // top
        case 0: 
          hit[ind] = Math.abs(head.y-this.stage.col-1);
          for (let i = head.y-1; i >= 0; i--) {
            if (data[head.x][i]) {
              hit[ind] = Math.abs(i-head.y);
              break;
            }
          }
          break;
        
        // right
        case 1: 
          hit[ind] = Math.abs(head.x-this.stage.row-1);
          for (let i = head.x+1; i < this.stage.col; i++) {
            if (data[i][head.y]) {
              hit[ind] = Math.abs(i-head.x);
              break;
            }
          }
          break;
          
        // bottom
        case 2: 
          hit[ind] = Math.abs(head.y-this.stage.col-1);
          for (let i = head.y+1; i < this.stage.row; i++) {
            if (data[head.x][i]) {
              hit[ind] = Math.abs(i-head.y);
              break;
            }
          }
          break;
        
        // left
        case 3:
          hit[ind] = Math.abs(head.x-this.stage.row-1);
          for (let i = head.x-1; i >= 0; i--) {
            if (data[i][head.y]) {
              hit[ind] = Math.abs(i-head.x);
              break;
            }
          }
          break;
          
        default: break;
      }
    }
    
    for (let e in hit) {
      output.push(Math.abs(1-(hit[e]/(e%2==0?this.stage.row-1:this.stage.col-1))));
    }
    
    output.push(direction[1]/4);
    output.push(top);
    output.push(right);
    output.push(bot);
    output.push(left);
    //console.log(direction)
    //console.log(output)
    return output;
  }
}