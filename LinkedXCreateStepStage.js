const XCS_NODE = 5, XCS_STEP  = 2
class LinkedXCreateStepStage extends CanvasStage {
    constructor() {
        super()
        this.xcs = new XCreateStep()
        this.animator = new XCSAnimator()
    }

    render() {
        super.render()
        if (this.xcs) {
            this.xcs.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.xcs.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.xcs.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedXCreateStepStage()
        stage.render()
        stage.handleTap()
    }
}


class XCSState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(cb) {
        this.scale += (0.1 / XCS_STEP) * this.dir
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

class XCSAnimator {
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
            clearInteral(this.interval)
        }
    }
}

class XCSNode {
    constructor(i) {
        this.i = i
        this.state = new XCSState()
    }

    addNeighbor() {
        if (this.i < XCS_NODE - 1) {
            this.next = new XCSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / (XCS_NODE + 1)
        const size = gap / 3
        context.save()
        context.translate(gap * this.i + gap, h/2)
        for (var j = 0; j < 2; j++) {
            const sf = 1 - 2 * j
            const sc = Math.min(0.5, Math.max(this.state.scale - j * 0.5, 0)) * 2
            context.save()
            context.scale(sf, sf)
            context.rotate(Math.PI/4)
            context.beginPath()
            context.moveTo(0, -size)
            context.lineTo(0, size)
            context.stroke()
            context.restore()
        }
        context.restore()
        if (this.prev) {
            this.prev.draw(context, w, h)
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

class XCreateStep {
    constructor() {
        this.curr = new XCSNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(cb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }

}
