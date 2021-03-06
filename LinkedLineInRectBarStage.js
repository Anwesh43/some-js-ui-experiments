const LIRB_NODES = 5
const LIRB_LINES = 4
const LIRB_scDiv = 0.51
const LIRB_scGap = 0.05
const LIRB_color = "#0D47A1"
const LIRB_sizeFactor = 2.2
const LIRB_strokeFactor = 90

const LIRB_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n
const LIRB_scaleFactor = (scale) => Math.floor(scale / LIRB_scDiv)
const LIRB_mirrorValue = (scale, a, b) => {
    const k = LIRB_scaleFactor(scale)
    return ((1 - k) / a) + (k / b)
}
const LIRB_updateScale = (scale, dir, a, b) => LIRB_mirrorValue(scale, a, b) * dir * LIRB_scGap

const drawLIRBNode = (context, i, scale, w, h) => {
    const gap = w / LIRB_NODES
    const size = gap / LIRB_sizeFactor
    context.lineWidth = Math.min(w, h) / LIRB_strokeFactor
    context.lineCap = 'round'
    context.strokeStyle = LIRB_color
    context.fillStyle = '#BDBDBD'
    const sc1 = LIRB_divideScale(scale, 0, 2)
    const sc2 = LIRB_divideScale(scale, 1, 2)
    context.save()
    context.translate(gap * (i + 1), h/2)
    for (var j = 0; j < 2; j++) {
        const sck = LIRB_divideScale(sc2, j, 2)
        context.save()
        context.rotate(-Math.PI/2 * sc1 * j)
        context.fillRect(-size, -size/2, size, size/2)
        const ox = -size + size * j
        const xGap = size / (LIRB_LINES + 1)
        const sf = 1 - 2 * j
        for (var k = 0; k < LIRB_LINES; k++) {
            const scj = LIRB_divideScale(sck, k, LIRB_LINES)
            context.save()
            context.translate(ox + xGap * (k+1) * sf, -size/2 + size/20)
            if (scj > 0) {
                context.beginPath()
                context.moveTo(0, 0)
                context.lineTo(0, (size/2 - size/10) * scj)
                context.stroke()
            }
            context.restore()
        }
        context.restore()
    }
    context.restore()
}

class LinkedLineInRectBarStage extends CanvasStage {
    constructor() {
        super()
        this.renderer = new LIRBRenderer()
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
        const stage = new LinkedLineInRectBarStage()
        stage.render()
        stage.handleTap()
    }
}

class LIRBState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += LIRB_updateScale(this.scale, this.dir, 1, LIRB_LINES * 2)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb(this.prevScale)
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class LIRBAnimator {
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

class LIRBNode {
    constructor(i) {
        this.i = i
        this.state = new LIRBState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LIRB_NODES - 1) {
            this.next = new LIRBNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        drawLIRBNode(context, this.i, this.state.scale, w, h)
        if (this.next) {
            this.next.draw(context, w, h)
        }
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    update(cb) {
        this.state.update(cb)
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

class LinkedLineInRectBar {
    constructor() {
        this.root = new LIRBNode(0)
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

class LIRBRenderer {
    constructor() {
        this.llir = new LinkedLineInRectBar()
        this.animator = new LIRBAnimator()
    }

    render(context, w, h) {
        this.llir.draw(context, w, h)
    }

    handleTap(cb) {
        this.llir.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.llir.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
