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

  class LRNode {
      constructor(i) {
          this.i = i
          this.state = new LRState()
          this.addNeighbor()
      }

      addNeighbor() {
          if (this.i < LR_NODES - 1) {
              this.next = new LRNode(this.i + 1)
              this.next.prev = this
          }
      }

      draw(context, w, h) {
          const deg = (2 * Math.PI) / LR_NODES
          const size = Math.min(w, h) / 3
          context.lineWidth = size/18
          context.lineCap = 'round'
          context.strokeStyle = ''
          context.save()
          context.translate(w/2, h/2)
          context.rotate(deg * i + deg * this.state.scale)
          context.beginPath()
          context.moveTo(0, 0)
          context.lineTo(size, 0)
          context.stroke()
          context.restore()
      }

      update(stopcb) {
          this.state.update(stopcb)
      }

      startUpdating(startcb) {
          this.state.startUpdating(startcb)
      }

      getNext(dir, cb) {
          var curr = this.prev
          if (dir == 1) {
              curr = this.next
          }
          if (curr) {
              return curr
          }
          cb()
          return this
      }
  }
