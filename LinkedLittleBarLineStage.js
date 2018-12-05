const LLBL_NODES = 5
const LLBL_BARS = 4
const LLBL_scDiv = 0.51
const LLBL_scGap = 0.05
const LLBL_sizeFactor = 3
const LLBL_DELAY = 25
const LLBL_strokeFactor = 90
const LLBL_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i/n)) * n
const LLBL_scaleFactor = (scale) => Math.floor(scale / LLBL_scDiv)
const LLBL_mirrorValue = (scale, a, b) => {
    const k = LLBL_scaleFactor(scale)
    return (1 - k) / a + k / b
}
const LLBL_updateScale = (scale, dir, a, b) => dir * LLBL_scGap * LLBL_mirrorValue(scale, a, b)

const drawLLBLNode = (context, i, scale, w, h) => {
    const gap = w / (LLBL_NODES + 1)
    const size = gap / LLBL_sizeFactor
    const sc1 = LLBL_divideScale(scale, 0, 2)
    const sc2 = LLBL_divideScale(scale, 1, 2)
    //console.log(`scale for 1 is ${sc1}`)
    context.strokeStyle = '#d32f2f'
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / LLBL_strokeFactor
    context.save()
    context.translate((i + 1) * gap, h/2)
    context.rotate(Math.PI/2 * sc2)
    const n = Math.sqrt(LLBL_BARS)
    for (var j = 0; j < n; j++) {
        context.save()
        context.scale((1 - 2 * j), 1)
        context.translate(size, 0)
        for (var p = 0; p < n; p++) {
            const k = j * n + p
            const sc = LLBL_divideScale(sc1, k, LLBL_BARS)
            context.save()
            context.translate(0, size * (1 - 2 * p) * sc)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-size/4, 0)
            context.stroke()
            context.restore()
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, size * (1 - 2 * p) * sc)
            context.stroke()
        }
        context.restore()
    }
    context.restore()
}

class LinkedLittleBarLineStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
        if (!this.renderer) {
            this.renderer = new LLBLRenderer()
        }
        this.renderer.render(this.context, this.size.w, this.size.h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage = new LinkedLittleBarLineStage()
        stage.render()
        stage.handleTap()
    }
}

class LLBLState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += LLBL_updateScale(this.scale, this.dir, LLBL_BARS, 1)
        console.log(this.scale)
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

class LLBLAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, LLBL_DELAY)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LLBLNode {
    constructor(i) {
        this.i = i
        this.addNeighbor()
        this.state = new LLBLState()
    }

    addNeighbor() {
        if (this.i < LLBL_NODES - 1) {
            this.next = new LLBLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        drawLLBLNode(context, this.i, this.state.scale, w, h)
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

class LinkedLittleBarLine {
    constructor() {
        this.root = new LLBLNode(0)
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

class LLBLRenderer {
    constructor() {
        this.llbl = new LinkedLittleBarLine()
        this.animator = new LLBLAnimator()
    }

    render(context, w, h) {
        this.llbl.draw(context, w, h)
    }

    handleTap(cb) {
        this.llbl.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.llbl.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
