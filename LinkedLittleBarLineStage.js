const LLBL_NODES = 5
const LLBL_BARS = 4
const LLBL_scDiv = 0.51
const LLBL_scGap = 0.05
const LLBL_sizeFactor = 2.1

const LLBL_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i/n)) * n
const LLBL_scaleFactor = (scale) => Math.floor(scale / LLBL_scDiv)
const LLBL_mirrorValue = (scale, a, b) => {
    const k = LLBL_scaleFactor(scale)
    return (1 - k) / a + k / b
}
const LLBL_updateScale = (scale, dir, a, b) => dir * LLBL_scGap * LLBL_mirrorValue(scale, a, b)

const drawLLBLNode = (context, i, scale, w, h) => {
    const gap = w / LLBL_NODES
    const size = gap / LLBL_sizeFactor
    const sc1 = LLBL_divideScale(scale, 0, 2)
    const sc2 = LLBL_divideScale(scale, 1, 2)
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
            context.lineTo(0, -size/4)
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
    }

    handleTap() {
        this.canvas.onmousedown = () => {

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
        this.scale = LLBL_updateScale(this.scale, this.dir, LLBL_BARS, 1)
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
