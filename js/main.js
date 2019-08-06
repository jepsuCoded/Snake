var game, _scene;

window.onload = function() {
  var isMobile = navigator.userAgent.indexOf("Mobile");
  if(isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
  }
  
  let w = 1080;
  let h = 1920;
  //if (isMobile != -1) {
  let a = h*window.innerWidth;
  h = a/w;
  w = window.innerWidth;
  // }
  
  var config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'phaser-game',
    pixelArt: true,
    antialias: false,
    dom: {
      createContainer: true
    },
    scale: {
      parent: 'phaser-game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      //roundPixel: true,
    },
    //autoRound: true,
    plugins: {
      scene: [{
        key: 'rexGestures',
        plugin: rexgesturesplugin,
        mapping: 'rexGestures'
      }],
    },
    audio: {
      disableWebAudio: true
    },
    /*
    input: {
      activePointers: 4,
    },*/
    
    backgroundColor: 0x2a2a3a,
    scene: [SceneLoad, SceneMain]
  };
  
  game = new Phaser.Game(config);
  game.cW = game.config.width/2;
  game.w = game.config.width;
  game.cH = game.config.height/2;
  game.h = game.config.height;
};
