class Snake {
  constructor({color, stage, pos, speed = 200, length = 3}) {
    // this.data: stores location of each body of snake
    // this.body: stores the graphic object of each snake's body
    this.data = [];
    this.body = [];
    
    this.stage = stage;
    
    // speed of this snake, default to 200ms
    this.speed = speed;
    
    // color of snake excluding head
    this.color = color;
    
    // prevent bottlenecking snake's speed with too much input
    this.inputQueue = {
      onQueue: false,
      next: -1
    };
    
    // Initial direction of snake
    // this.direction = direction;
    
    // randomly place a snake if 'pos' is undefined
    if (!pos) {
      pos = {
        x: Math.floor(Math.random()*(this.stage.col))+1,
        y: Math.floor(Math.random()*(this.stage.row))+1
      };
    }
    
    // create the snake body with the given length, default to 3
    for (let i = 0; i < length; i++) {
      let c = i === 0 ? color.head : i === length-1 ? color.tail : color.body;
      this.grow(pos, c);
      if (i === 0) 
        this.body[i].setDepth(1);
    }
    
    // draw body to canvas, not technically draws it but
    // position each body of snake to their designated
    // position in the grid
    this.draw();
    
    // is this snake dead? nope initially
    this.gameOver = false;
    
    // snake's score
    this.gameScore = 0;
  }
  
  // direction to move (0, 1, 2 ,3)
  dir(n) {
    
    // prevents the snake from going backwards
    let wrong = [2, 3, 0, 1];
    if (wrong[this.direction] == n || this.inputQueue.onQueue || this.direction === n) return;
    
    // set it to current direction
    this.direction = n;
    
    this.inputQueue.onQueue = true;
    this.inputQueue.next = n;
  }
  
  // every 'this.speed' interval
  // snake will move to current direction its moving
  goTo(direction = this.direction) {
    
    // if snake dies or its not moving yet then do nothing
    if (this.gameOver || typeof this.direction == 'undefined') return;
    
    if (!this.inputQueue.onQueue && this.inputQueue.next >= 0) {
      direction = this.inputQueue.next;
      this.direction = direction;
      this.inputQueue.next = -1;
    }
    
    // index position of snake's head
    // (always at the end of array)
    let head = this.data.length-1;
    
    // x and y position of snake's head
    let headX = this.data[head].x;
    let headY = this.data[head].y;
    
    // snake will move to this direction and just hope
    // that snake won't die
    switch (direction) {
      // up
      case 0: 
        this.data[head] = this.movePosition(this.data[head], 0, -1);
        break;
      // right
      case 1: 
        this.data[head] = this.movePosition(this.data[head], 1, 0);
        break;
      // down
      case 2: 
        this.data[head] = this.movePosition(this.data[head], 0, 1);
        break;
      // right
      case 3: 
        this.data[head] = this.movePosition(this.data[head], -1, 0);
        break;
      default: console.log('invalid input');
    }
    
    // update each of snake's body position
    // relative to the snake's head movement
    for (let i = 0; i < head; i++) {
      let x = this.data[i+1].x;
      let y = this.data[i+1].y;
      if (i == head-1) 
        x = headX, y = headY;
      this.data[i] = {x,y};
    }
    
    // check if apple is in snake's head
    if (this.checkApple()) {
      
      // if yes then grow a tail!
      let tail = this.data[0];
      this.grow(tail);
    }
    
    if (!this.checkCollision(this.data[this.data.length-1]))
      this.gameEnded();
    
    // update snake's position in the canvas
    this.draw();
  }
  
  // move 'point' by 'x' and 'y' step
  movePosition(point, x, y) {
    
    // update 'point' to new location
    // and stores it at 'output'
    let output = {x: point.x+x, y: point.y+y};
    
    // if 'output' is inside the stage then return the new point
    if (this.isValidPosition(output)) {
      return output;
    }
    
    // else then snake has died. rip snake
    this.gameEnded();
    
    // no changes to the 'point'
    return point;
  }
  
  // if 'point' is inside 'this.stage'
  // then its a valid position
  isValidPosition(point) {
    let col = this.stage.grid.config.cols-1;
    let row = this.stage.grid.config.rows-1;
    
    // if out of bounds then not a valid 'point'
    if (point.x < 1 || point.x >= col || point.y < 1 || point.y >= row)
      return false;
    return true;
  }
  
  // check if snake's head is hitting its own body
  checkCollision(point) {
    
    // length-2 so that it won't include
    // the head itself for checking collisions
    let len = this.data.length-2;
    for (let j = 0; j < len; j++) {
      
      // basically check if x and y of head is the same with x and y
      // of one of its body, then its a collision. Bye snake, rip.
      if (point.x === this.data[j].x && point.y === this.data[j].y)
        return false;
    }
    
    return true;
  }
  
  
  // check if snake's head has apple
  checkApple() {
    let head = this.data.length-1;
    let x = this.data[head].x;
    let y = this.data[head].y;
    
    if (x == this.apple.point.x && y == this.apple.point.y) {
      // update snake's score;
      this.gameScore++;
      
      // place a new apple randomly in an empty area
      this.apple.placeApple(this);
      
      return true;
    }
  }
  
  gameEnded() {
    this.stage.ui.gameOver.setVisible(true);
    this.gameOver = true;
  }
  
  grow(tail, color = this.color.body, outline = this.color.outline) {
    // insert a new tail at index 0 of snake's body data
    // and snake's body graphic object
    this.data.unshift({x: tail.x, y: tail.y});
    this.body.unshift(_scene.add.rectangle(tail.x, tail.y, this.stage.grid.cw, this.stage.grid.ch, color)
      .setStrokeStyle(1, outline));
  }
  
  // not literally draw but just repositioning each snake's body
  // relative to the movement of snake's head
  draw() {
    if (this.gameOver) return;
    for (let i in this.body) {
      if (i < 1) 
        this.body[i].fillColor = this.color.tail;
      else if (i < this.body.length-1)
        this.body[i].fillColor = this.color.body;
      else
        this.body[i].fillColor = this.color.head;
        
      let {x, y} = this.data[i];
      this.stage.grid.placeAt(x, y, this.body[i]);
    }
    this.inputQueue.onQueue = false;
  }
}