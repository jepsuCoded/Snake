class Stage {
  constructor(scene, size, color) {
    let fixedHeight = game.w/size.col*size.row;
    this.grid = new AlignGrid({
      scene: scene,
      cols: size.col+2,
      rows: size.row+2,
      height: fixedHeight,
    });
    
    this.col = size.col;
    this.row = size.row;
    
    this.bg = scene.add.rectangle(this.grid.config.x, this.grid.config.y, this.grid.config.width, this.grid.config.height, color.bg).setOrigin(0, 0);
    
    this.boundery(color.border, scene);
    
    //this.grid.show();
    
    this.ui = {
      gameOver: scene.add.text(game.cW, game.cH*1.3, 'Game Over!', {
        fontSize: this.grid.cw*2,
        color: '#000000',
        align: 'center',
      }).setOrigin(0.5, 1).setVisible(false).setDepth(12),
      score: scene.add.text(game.cW*0.1, game.h-25, 'Score: 0', {
        fontSize: this.grid.cw*0.75,
        align: 'left',
      }).setOrigin(0, 0.5).setDepth(11),
    };
    
    this.grid.placeAt(0, size.row+1, this.ui.score);
    this.grid.placeAt((size.col+2)*0.5, (size.row+2)*0.5, this.ui.gameOver);
  }
  
  
  boundery(color, scene) {
    let config = {
      x: this.grid.config.x,
      y: this.grid.config.y,
      width: this.grid.config.width,
      height: this.grid.config.height
    };
    
    let cw = this.grid.cw;
    let ch = this.grid.ch;
    
    this.border = {
      top: scene.add.rectangle(config.x, config.y, config.width, ch, color).setOrigin(0, 0).setDepth(10),
      right: scene.add.rectangle(config.width-cw, config.y, cw, config.height, color).setOrigin(0, 0).setDepth(10),
      bottom: scene.add.rectangle(config.x, config.height-ch, config.width, ch, color).setOrigin(0, 0).setDepth(10),
      left: scene.add.rectangle(config.x, config.y, cw, config.height, color).setOrigin(0, 0).setDepth(10),
    };
  }
}