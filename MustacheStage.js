class MustacheStage extends CanvasStage {
    constructor () {
        super()
    }
    render() {

    }
    handleTap() {

    }
}
class MustacheState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
        this.deg = 0
    }
    update() {
      this.deg += this.dir * Math.PI / 20
      this.scale = Math.sin(this.deg)
      if (this.deg > Math.PI) {
          this.deg = 0
          this.dir = 0
      }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class MustacheAnimator {
    constructor () {
        this.animated = false
    }
    start (updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop () {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
