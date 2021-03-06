/// <reference path="Phaser.d.ts" />
import Scene from './Scene' // eslint-disable-line no-unused-vars

/** @private {!Scene} _scene
 *  @private {?Phaser.BitmapText} _fpsText */
export default class GameState extends Phaser.State {
  /** @param {!Phaser.Game} game
      @param {!Scene} scene */
  constructor(game, scene) {
    console.log('GameState: constructor') // eslint-disable-line no-console
    super(game)
    this._scene = scene
  }

  /** @param {!Phaser.Game} game
      @return {void} */
  preload(game) {
    super.preload(game)
    console.log('GameState: preload') // eslint-disable-line no-console

    // for fps counter
    game.time.advancedTiming = true

    game.renderer.renderSession.roundPixels = true
    game.camera.roundPx = false // this should be true but creates jitter
    Phaser.Canvas.setImageRenderingCrisp(game.canvas)

    game.load.bitmapFont('mem', 'static/mem.png', 'static/mem.fnt')
    game.load.bitmapFont('mem mono', 'static/mem.png', 'static/mem-mono.fnt')

    window.addEventListener('resize', () => this.resize())

    this._scene.preload(game)
  }

  /** @param {!Phaser.Game} game
      @return {void} */
  create(game) {
    super.create(game)
    console.log('GameState: create') // eslint-disable-line no-console
    this._scene.create(game)
    const size = 4
    this._fpsText = game.add.bitmapText(1, 1, 'mem mono', '0', size)
    this._fpsText.fixedToCamera = true
    this.resize()

    const x = 20
    game.add.bitmapText(x, 1, 'mem',
      'Once & Future Cactus\nA Summary of You ~', size)
  }

  /** @param {!Phaser.Game} game
      @return {void} */
  update(game) {
    super.update(game)
    this._scene.update(game)
  }

  /** @param {!Phaser.Game} game
      @return {void} */
  render(game) {
    super.render(game)
    this._scene.render(game)

    const fps = `${game.time.fps}`
    this._fpsText.text = fps.length < 2 ? `0${fps}` : fps
  }

  /** @return {void} */
  resize() {
    const scale = window.innerHeight / this._scene.height()
    const nativeWidth = Math.floor(window.innerWidth / scale)
    const nativeHeight = Math.floor(this._scene.height())

    // eslint-disable-next-line no-console
    console.log(`GameState: resize scale=${scale} `
      + `native=${nativeWidth}x${nativeHeight} `
      + `scene=${this._scene.width()}x${this._scene.height()} `
      + `window=${window.innerWidth}x${window.innerHeight} `
      + `ratio=${window.innerWidth / window.innerHeight}`)

    this.game.scale.setGameSize(nativeWidth, nativeHeight)
    this.game.camera.bounds = new Phaser.Rectangle(0, 0, this._scene.width(),
      this._scene.height())
    this._scene.resize(this.game)
  }
}