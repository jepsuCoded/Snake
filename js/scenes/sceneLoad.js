class SceneLoad extends Phaser.Scene {
  constructor() {
    super ('SceneLoad');
  }
  
  preload() {
    // Load assets here
  }
  
  create() {
    this.startGame();
  }
  
  startGame() {
    this.scene.start('SceneMain');
  }
}