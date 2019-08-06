class Apple {
  constructor(stage, {size = 1, color = {fill: 0xd44e52, outline: 0xfff8c0}}) {
    // the stage that apple will placed on
    this.stage = stage;
    
    // apple's current position
    this.point = {
      x: 0,
      y: 0
    };
    
    // apple's last placed position
    this.lastPos = {};
    
    this.body = _scene.add.rectangle(this.point.x, this.point.y, this.stage.grid.cw*size, this.stage.grid.ch*size, color.fill)
      .setStrokeStyle(1, color.outline);
  }
  
  placeApple(snakeObj) {
    this.stage.ui.score.setText('Score: ' + snakeObj.gameScore);
    this.lastPos = this.point;
    
    let snake = snakeObj.data;
    let emptyPoint = [];
    
    for (let i = 1; i < this.stage.grid.config.rows-1; i++) {
      for (let j = 1; j < this.stage.grid.config.cols-1; j++) {
        let isEmpty = true;
        for (let body of snake) {
          if ((j === body.x && i === body.y) || (j === this.lastPos.x && i === this.lastPos.y))
            isEmpty = false;
        }
        if (isEmpty) 
          emptyPoint.push({x: j, y: i});
      }
    }
    
    let r = Math.floor(Math.random()*emptyPoint.length);
    this.point.x = emptyPoint[r].x;
    this.point.y = emptyPoint[r].y;
    
    this.draw();
  }
  
  draw() {
    this.stage.grid.placeAt(this.point.x, this.point.y, this.body);
  }
}