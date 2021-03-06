const BCS_NODES = 5
const BCS_beads = 6
const BCS_scDiv = 0.51
const BCS_scGap = 0.05
const BCS_color = "#1A237E"
const BCS_strokeFactor = 90
const BCS_sizeFactor = 2.5
const BCS_rFactor = 8
const BCS_delay = 25

const BCS_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const BCS_scaleFactor = (scale) => Math.floor(scale / BCS_scDiv)

const BCS_mirrorValue = (scale, a, b) => {
    const k = BCS_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const BCS_updateScale = (scale, dir, a, b) => dir * BCS_scGap * BCS_mirrorValue(scale, a, b)

const drawBCSNode = (context, i, scale, w, h) => {
    const gap = w / (BCS_NODES + 1)
    const size = gap / BCS_sizeFactor
    const sc1 = BCS_divideScale(scale, 0, 2)
    const sc2 = BCS_divideScale(scale, 1, 2)
    const r = size / 8
    context.strokeStyle = BCS_color
    context.fillStyle = BCS_color
    context.lineWidth = Math.min(w, h) / BCS_strokeFactor
    context.lineCap = 'round'
    context.save()
    context.translate(gap * (i + 1), h/2)
    context.beginPath()
    context.arc(0, 0, size, 0, 2 * Math.PI)
    context.stroke()
    context.rotate(sc2 * Math.PI/2)
    const degGap = 2 * Math.PI / BCS_beads
    var deg = 0
    for (var j = 0; j < BCS_beads; j++) {
        const sc = BCS_divideScale(sc1, j, BCS_beads)
        deg += degGap * sc
        context.save()
        context.rotate(deg)
        context.beginPath()
        context.arc(0, -2*size/3, r, 0, 2*Math.PI)
        context.fill()
        context.restore()
    }
    context.restore()
}

class LinkedBeadsCricleStepStage extends CanvasStage {
    constructor() {
        super()
        this.renderer = new BCSRenderer()
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
        const stage = new LinkedBeadsCricleStepStage()
        stage.render()
        stage.handleTap()
    }
}

class BCSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += BCS_updateScale(this.scale, this.dir, BCS_beads, 1)
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

class BCSAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, BCS_delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class BCSNode {
    constructor(i) {
        this.i = i
        this.state = new BCSState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < BCS_NODES - 1) {
            this.next = new BCSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        drawBCSNode(context, this.i, this.state.scale, w, h)
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

class LinkedBeadCricleStep {
    constructor() {
        this.root = new BCSNode(0)
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
            cb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}

class BCSRenderer {
    constructor() {
        this.lbcs = new LinkedBeadCricleStep()
        this.animator = new BCSAnimator()
    }

    render(context, w, h) {
        this.lbcs.draw(context, w, h)
    }

    handleTap(cb) {
        this.lbcs.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lbcs.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
