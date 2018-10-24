const RS_NODES = 5
const RS_STEPS = 10
class LinkedRectShifterStage extends CanvasStage {
    constructor() {
        super()
        this.lrs = new LinkedRectShifter()
        this.animator = new RSAnimator()
    }

    render() {
        super.render()
        if (this.lrs) {
            this.lrs.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lrs.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lrs.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedRectShifterStage()
        stage.render()
        stage.handleTap()
    }
}

class RSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += (0.1 / RS_STEPS) * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class RSAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 25)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class RSNode {
    constructor(i) {
        this.i = i
        this.state = new RSState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < RS_NODES - 1) {
            this.next = new RSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = h / (RS_NODES + 1)
        const scGap = 1.0 / RS_STEPS
        const sf = 1 - 2 * (this.i % 2)
        const size = (gap) / 3
        const gapSize = size / RS_STEPS
        context.fillStyle = '#673AB7'
        context.strokeStyle = '#673AB7'
        context.save()
        context.translate(w/2, this.i * gap + gap)
        context.scale(sf, 1)
        for (var j = 0; j < RS_STEPS; j++) {
            const sc = Math.min(scGap, Math.max(0, this.state.scale - scGap * j)) * RS_STEPS
            context.save()
            context.translate((w/2 - size) * sc, gapSize * j)
            context.fillRect(-size, 0, 2 * size, gapSize)
            context.strokeRect(-size, 0, 2 * size, gapSize)
            context.restore()
        }
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
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

class LinkedRectShifter {
    constructor() {
        this.root = new RSNode(0)
        this.curr = this.root
        this.dir = 1
    }

    draw(context, w, h) {
        this.root.draw(context, w, h)
    }

    update(cb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}
