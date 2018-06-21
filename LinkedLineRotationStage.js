const LR_NODES = 5

class LinkedLineRotationStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
  }

  class LRState {
      constructor() {
          this.scale = 0
          this.dir = 0
          this.prevScale = 0
      }

      update(stopcb) {
          this.scale += this.dir * 0.1
          if (Math.abs(this.scale - this.prevScale) > 1) {
              this.scale = this.prevScale + this.dir
              this.dir = 0
          }
      }

      startUpdating(startcb) {
          if (this.dir == 0) {
              this.dir = 1 - 2 * this.prevScale
              startcb()
          }
      }
  }

  class LRAnimator {

      constructor() {
          this.animated = false
      }

      start(cb) {
          if (!this.animated) {
              this.animated = true
              this.interval = setInterval(() => {
                  cb()
              }, 50)
          }
      }

      stop() {
          if (this.animated) {
              this.animated = false
              clearInterval(this.interval)
          }
      }
  }
