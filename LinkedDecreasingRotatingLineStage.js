const DRL_NODES = 5

class LinkedDecreasingRotatingLineStage extends CanvasStage {
    constructor() {
        super()
        this.drl = new LinkedDecreasingRotatingLine()
        this.animator = new DRLAnimator()
    }

    render() {
        super.render()
        if (this.drl) {
            this.drl.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.drl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.drl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedDecreasingRotatingLineStage()
        stage.render()
        stage.handleTap()
    }
}

class DRLState {
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

class DRLAnimator {
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

class DRLNode {
    constructor(i) {
        this.i = i
        this.state = new DRLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < DRL_NODES - 1) {
            this.next = new DRLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = 2 * Math.PI / DRL_NODES
        const size = (Math.min(w, h) / 3) / (DRL_NODES)
        context.strokeStyle = '#43A047'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        context.save()
        context.translate(w/2, h/2)
        context.rotate(this.i * gap + gap * this.state.scale)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo((this.i + 1) * size + size * this.state.scale, 0)
        context.stroke()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
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

class LinkedDecreasingRotatingLine {
    constructor() {
        this.curr = new DRLNode(0)
        this.dir = 1
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

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }
}
