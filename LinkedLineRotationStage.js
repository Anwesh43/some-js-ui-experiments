const LR_NODES = 5

class LinkedLineRotationStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new LRAnimator()
        this.lrl = new LinkedRotationLine()
    }

    render() {
        super.render()
        if (this.lrl) {
            this.lrl.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lrl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lrl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedLineRotationStage()
        stage.render()
        stage.handleTap()
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
              this.prevScale = this.scale
              stopcb()
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
          context.strokeStyle = '#E1E1E1'
          if (this.prev) {
              this.prev.draw(context, w, h)
          }
          context.save()
          context.translate(w/2, h/2)
          context.save()
          context.rotate(deg * this.i + deg * this.state.scale)
          context.beginPath()
          context.moveTo(0, 0)
          context.lineTo(size, 0)
          context.stroke()
          context.restore()
          context.fillStyle = '#E1E1E1'
          context.beginPath()
          context.moveTo(0, 0)
          const startDeg = this.i * deg, endDeg = startDeg + deg * this.state.scale
          for(var i = startDeg; i <= endDeg; i+=Math.PI/180) {
              context.lineTo((size/4) * Math.cos(i), (size/4) * Math.sin(i))
          }
          context.fill()
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

  class LinkedRotationLine {

      constructor() {
          this.curr = new LRNode(0)
          this.dir = 1
      }

      draw(context, w, h) {
          this.curr.draw(context, w, h)
      }

      update(stopcb) {
          this.curr.update(() => {
              this.curr = this.curr.getNext(this.dir, () => {
                  this.dir *= -1
              })
              stopcb()
          })
      }

      startUpdating(startcb) {
          this.curr.startUpdating(startcb)
      }
  }
