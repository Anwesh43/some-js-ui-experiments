const BCS_NODES = 5
const BCS_beads = 6
const BCS_scDiv = 0.51
const BCS_scGap = 0.05
const BCS_color = "#1A237E"
const BCS_strokeFactor = 90
const BCS_sizeFactor = 2.5
const BCS_rFactor = 8

const BCS_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const BCS_scaleFactor = (scale) => Math.floor(scale / BCS_scDiv)

const BCS_mirrorValue = (scale, a, b) => {
    const k = BCS_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const BCS_updateScale = (scale, dir, a, b) => dir * BCS_scGap * BCS_mirrorValue(scale, a, b)

const drawBCSNode => (context, i, scale, w, h) => {
    const gap = w / (BCS_NODES + 1)
    const size = gap / BCS_sizeFactor
    const sc1 = BCS_divideScale(scale, 0, 2)
    const sc2 = BCS_divideScale(scale, 1, 2)
    const r = size / 8
    context.strokeStyle = color
    context.fillStyle = color
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
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage = new LinkedBeadsCircleStepStage()
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
