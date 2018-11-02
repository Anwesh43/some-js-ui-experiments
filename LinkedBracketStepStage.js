const LBSS_NODES = 5
const LBSS_SIDES = 3
const LBSS_FACTOR = 2

const LBSS_divideScale = (scale, i, n) => Math.min((1/n), Math.max(0, scale - (1/n) * i))

const LBSS_drawLines = [(context, size, sc) => {
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo((size) * sc, 0)
    context.stroke()
}, (context, size, sc) => {
    context.beginPath()
    context.moveTo(size, 0)
    context.moveTo(size, 2 * size * sc)
    context.stroke()
}, (context, size, sc) => {
    context.beginPath()
    context.moveTo(size, 2 * size)
    context.lineTo(size - size * sc, 2 * size)
    context.stroke()
}]
class LinkedBrackedStepStage extends CanvasStage {
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

class LBSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.05 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.prevScale == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class LBSSAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LBSSNode {
    constructor(i) {
        this.i = i
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LBSS_NODES) {
            this.next = new LBSSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / (nodes + 1)
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#1A237E'
        const size = gap / 3
        context.save()
        context.translate(this.i * gap + gap, h/2)
        for (var i = 0; i < LBSS_FACTOR; i++) {
            const sc = LBSS_divideScale(this.state.scale, i, LBSS_FACTOR)
            context.save()
            context.scale(1 - 2 * i, 1)
            for(var j = 0; j < LBSS_SIDES; j++) {
                context.save()
                context.translate(0, -size)
                const scj = LBSS_divideScale(sc, j, LBSS_SIDES)
                LBSS_drawLines(context, size, scj)
                context.restore()
            }
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

class LinkedBracketStep {
    constructor() {
        this.curr = new LBSSNode()
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
