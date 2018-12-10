const LES_NODES = 5
const LES_LINES = 2
const LES_LINE_WIDTH = 60
const LES_COLOR = "#0D47A1"
const LES_SIZE_FACTOR = 3
const LES_STROKE_FACTOR = 80
const LES_scGap = 0.05
const LES_scDiv = 0.51
const delay = 25

const LES_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const LES_scaleFactor = (scale) =>  Math.floor(scale / LES_scDiv)

const LES_mirrorValue = (scale, a, b) => {
    const k = LES_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const LES_updateScale = (scale, dir, a, b) => LES_mirrorValue(scale, a, b) * dir * LES_scGap

const drawLESNode = (context, i, scale, w, h) => {
    const gap = w / (LES_NODES + 1)
    const sc1 = LES_divideScale(scale, 0, 2)
    const sc2 = LES_divideScale(scale, 1, 2)
    const size = gap / LES_SIZE_FACTOR
    context.strokeStyle = LES_COLOR
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / LES_STROKE_FACTOR
    context.save()
    context.translate(gap * (i + 1), h/2)
    for (var j = 0; j < LES_LINES; j++) {
        const sf = 1 - 2 * j
        const sc01 = LES_divideScale(sc1, j, LES_LINES)
        const sc02 = LES_divideScale(sc2, LES_LINES - 1 - j, LES_LINES)
        const y = (-size/2 + size * Math.floor((j + 1)/2)) * (1 - sc02)
        if (sc02 < 1) {
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, y)
            context.stroke()
        }
        context.save()
        context.translate(0, y)
        context.rotate(Math.PI/2 * sc01)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, size * sf)
        context.stroke()
        context.restore()
    }
    context.restore()
}
class LinkedLineExpanderStepStage extends CanvasStage {
    constructor() {
        super()
        this.renderer = new LESRenderer()
    }
    render() {
        super.render()
        if (this.renderer) {
            this.renderer.render(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage = new LinkedLineExpanderStepStage()
        stage.render()
        stage.handleTap()
    }
}

class LESState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(cb) {
        this.scale += LES_updateScale(this.scale, this.dir, LES_LINES, LES_LINES)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
            console.log("stopping to update")
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            console.log("starting state")
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class LESAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        console.log("start anim 1")
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
            console.log("starting anim 2")
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
            console.log("stopping here")
        }
    }
}

class LESNode {
    constructor(i) {
        this.i = i
        this.state = new LESState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LES_NODES - 1) {
            this.next = new LESNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        drawLESNode(context, this.i, this.state.scale, w, h)
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

class LineExpanderStep {
    constructor() {
        this.root = new LESNode(0)
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
            console.log(this.curr)
            cb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}

class LESRenderer {
    constructor() {
        this.les = new LineExpanderStep()
        this.animator = new LESAnimator()
    }

    render(context, w, h) {
        this.les.draw(context, w, h)
    }

    handleTap(cb) {
        this.les.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.les.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
