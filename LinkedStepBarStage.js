const LSB_NODES = 5
class LinkedStepBarStage extends CanvasStage{
    constructor() {
        super()
        this.linkedStepBar = new LinkedStepBar()
        this.animator = new LSBAnimator()
    }

    render() {
        super.render()
        if (this.linkedStepBar) {
            this.linkedStepBar.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedStepBar.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedStepBar.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedStepBarStage()
        stage.render()
        stage.handleTap()
    }
}

class LSBState {
    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class LSBAnimator {

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

class LSBNode {
    constructor(i) {
        this.i = i
        this.state = new LSBState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LSB_NODES - 1) {
            this.next = new LSBNode(this.i+1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.fillStyle = '#e67e22'
        context.strokeStyle = context.fillStyle
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const w_gap = (w / LSB_NODES), h_gap = (h / LSB_NODES), size = Math.min(w_gap, h_gap)
        context.save()
        context.translate(-w_gap/2 + w_gap * this.i, -h_gap/2 + h_gap * this.i)
        context.beginPath()
        context.moveTo(size/2 + (w_gap) * this.state.scales[1], size/2)
        context.lineTo(size/2 + (w_gap) * this.state.scales[0], size/2)
        context.stroke()
        context.beginPath()
        context.moveTo(size/2 + w_gap, size/2 + (h_gap) * this.state.scales[2])
        context.lineTo(size/2 + w_gap, size/2 + (h_gap) * this.state.scales[1])
        context.stroke()
        context.fillRect(w_gap * this.state.scales[0], h_gap * this.state.scales[1], size, size)
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

class LinkedStepBar {

    constructor() {
        this.curr = new LSBNode(0)
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
