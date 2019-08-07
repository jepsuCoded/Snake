class GenUI {
  constructor({
    scene, stretch = true,
      cols = 9, rows = 16,
      width = window.innerWidth,
      height = window.innerHeight,
      x = 0, y = 0
  }) {
    
    if (!scene) {
      console.log("Class GenUI ERROR: Missing Scene");
      return;
    }
    
    if (!stretch)
      height = width/cols*rows;
    
    //make a class level reference to the scene
    this.scene = scene;
    
    //add graphics
    this.graphics = {
      obj: this.scene.add.graphics().setDepth(10),
      visible: false,
      textIndex: [],
      textXY: []
    };
    
    this.grid = {
      cols: cols,
      rows: rows,
      cell: {
        w: width/cols,
        h: height/rows
      },
      width: width,
      height: height,
      x: x,
      y: y,
      centerX: (cols-1)/2,
      centerY: (rows-1)/2,
    };
    
    this.add = {};
    this.default = {};
    
    this.initializeGrid();
    this.initializeText({});
  }
  
  initializeGrid() {
    this.resize = obj => (width = 1, height = 1) => {
      obj.displayWidth = width*this.grid.w;
      obj.displayHeight = height*this.grid.h;
    };
    
    this.move = obj => (x, y) => {
      
      if (typeof y === 'undefined') {
        y = Math.floor(x/this.grid.cols);
        x = x-(y*this.grid.cols);
      } //else x -= 0.5, y -= 0.5;
      
      //calc position based upon the cellwidth and cellheight
      obj.x = (this.grid.cell.w*x+this.grid.cell.w/2)+this.grid.x;
      obj.y = (this.grid.cell.h*y+this.grid.cell.h/2)+this.grid.y;
    };
    
    this.setGrid = {
      position: (x1, y1) => (x2, y2) => {
          this.grid.x = x1, this.grid.y = y1;
          this.grid.width = x2, this.grid.height = y2;
          this.grid.cell = {
            w: x2/this.grid.cols,
            h: y2/this.grid.rows
          };
        },
        size: (cols, rows) => {
          this.grid.cols = cols, this.grid.rows = rows;
        }
    };
  }
  
  initializeText({fontSize, color, align, fontFamily}) {
    if (!fontSize) fontSize = this.grid.cell.w*0.6;
    
    this.default.text = {
      style: {
        fontSize: fontSize,
        color: color || '#000',
        align: align || 'center',
        fontFamily: fontFamily || 'Times New Roman',
      },
      depth: 6,
      origin: [0.5, 0.5]
    };
    
    this.default.button = {
      depth: 5,
      origin: [0.5, 0.5]
    };
    
    this.add.text = (text = 'empty text') => (x, y, config) => {
      if (!config) {
        config = {
          depth: this.default.text.depth,
          origin: this.default.text.origin,
          style: this.default.text.style
        };
      }
      
      let output = this.scene.add.text(0, 0, text, config.style);
      output.setDepth(config.depth)
        .setOrigin(config.origin[0], config.origin[1]);
      output.move = (x, y) => this.move(output)(x, y);
      this.move(output)(x, y);
      
      return output;
    };
    
    this.add.button = (text, bg, isIcon) => (x, y, config) => {
      let button, buttonText;
      if (!config) {
        config = {
          depth: this.default.button.depth,
          origin: this.default.button.origin,
          style: this.default.text.style
        };
      }
      
      if (isIcon)
        buttonText = this.scene.add.image(0, 0, text);
      else
        buttonText = this.add.text(text)(x, y, config);
      
      buttonText
        .setDepth(config.depth+1)
        .setOrigin(config.origin[0], config.origin[1]);
      
      let padding = this.grid.cell.w/2;
      let btWidth = buttonText.width+padding;
      let btHeight = buttonText.height+(padding);
      
      if (typeof bg === 'string') {
        button = this.scene.add.image(0, 0, bg);
        button.innerWidth = btWidth;
        button.innerHeight = btHeight;
      } else if (typeof bg === 'number')
        button = this.scene.add.rectangle(0, 0, btWidth, btHeight, bg);
      else
        console.log('GenUI Add Button: Invalid button bg');
      
      //console.log(buttonText.width)
      
      button
        .setDepth(config.depth)
        .setOrigin(config.origin[0], config.origin[1]);
      //.setVisible(false);
      
      this.move(button)(x, y);
      this.move(buttonText)(x, y);
      
      let output = {
        obj: button,
        text: buttonText,
      };
      
      output.on = (event, callback) => output.obj.setInteractive().on(event, callback);
      
      output.move = (x, y) => {
        this.move(output.obj)(x, y);
        this.move(output.text)(x, y);
      };
      
      return output;
    };
  }
  
  showGrid(withNumbers = 0) {
    this.graphics.visible = true;
    
    this.graphics.obj.clear();
    
    //set a line style
    this.graphics.obj.lineStyle(18/this.grid.cols, 0x523c4e);
    
    //draw vertical lines
    for (let i = 0; i <= this.grid.width; i += this.grid.cell.w) {
      this.graphics.obj.moveTo(i+this.grid.x, this.grid.y);
      this.graphics.obj.lineTo(i+this.grid.x, this.grid.height+this.grid.y);
    }
    
    //draw horizontal lines
    for (let i = 0; i <= this.grid.height; i += this.grid.cell.h) {
      this.graphics.obj.moveTo(this.grid.x, i+this.grid.y);
      this.graphics.obj.lineTo(this.grid.width+this.grid.x, i+this.grid.y);
    }
    
    this.graphics.obj.strokePath();
    
    if (withNumbers > 0) {
      if (this.graphics.textIndex.length > 0) {
        for (let obj in this.graphics.text) {
          if (withNumbers === 1) this.graphics.textIndex[obj].setVisible(true);
          if (withNumbers === 2) this.graphics.textXY[obj].setVisible(true);
        }
        return;
      }
      
      let index = 0;
      for (let i = 0; i < this.grid.rows; i++) {
        for (let j = 0; j < this.grid.cols; j++) {
          
          if (withNumbers === 1) {
            this.graphics.textIndex.push(this.scene.add.text(0, 0, index, {
              color: '#ff0000', fontSize: this.grid.cell.w*0.5
            }).setDepth(10).setOrigin(0.5, 0.5));
            
            this.move(this.graphics.textIndex[index])(index);
          }
          
          if (withNumbers === 2) {
            let xy = `${j},${i}`;
            
            this.graphics.textXY.push(this.scene.add.text(0, 0, xy, {
              color: '#ff0000', fontSize: this.grid.cell.w*0.4
            }).setDepth(10).setOrigin(0.5, 0.5));
            
            this.move(this.graphics.textXY[index])(j, i);
          }
          
          index++;
        }
      }
    }
  }
  
  hideGrid() {
    if (!this.graphics.visible) return;
    
    this.graphics.visible = false;
    this.graphics.obj.clear();
    for (let obj in this.graphics.textIndex) {
      this.graphics.textIndex[obj].setVisible(false);
      this.graphics.textXY[obj].setVisible(false);
    }
  }
}