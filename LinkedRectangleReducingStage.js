const RR_NODES = 10
class LinkedRectangleReducingStage extends CanvasStage {
    constructor() {
        super()
        this.rr = new ReducingRectangle()
        this.animator = new RRAnimator()
    }

    render() {
        super.render()
        if (this.rr) {
            this.rr.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.rr.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.rr.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedRectangleReducingStage()
        stage.render()
        stage.handleTap()
    }
}

class RRState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir
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

class RRAnimator {
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

class RRNode {
    constructor(i) {
        this.i = i
        this.state = new RRState()
        this.addNeighbor()
    }
    addNeighbor() {
        if (this.i < RR_NODES - 1) {
            this.next = new RRNode(this.i + 1)
            this.next.prev = this
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        const gap = w/ RR_NODES
        context.save()
        context.translate(gap * (this.i+1) * this.state.scale, h - gap/20 - this.i * context.lineWidth)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(gap, 0)
        context.stroke()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
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

class ReducingRectangle {
    constructor() {
        this.root = new RRNode(0)
        this.curr = this.root
        this.dir = 1
    }

    draw(context, w, h) {
        context.strokeStyle = '#BF360C'
        context.lineWidth = Math.min(w, h) / 26
        this.root.draw(context, w, h)
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
