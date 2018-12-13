const BBO_NODES = 5
const BBO_BALLS = 2
const BBO_scDiv = 0.51
const BBO_scGap = 0.05
const BBO_strokeFactor = 90
const BBO_sizeFactor = 3
const BBO_color = "#e74c3c"

const BBO_divideScale = (scale, i, n) => {
    return Math.min(1/n, Math.max(0, scale - i/n)) * n
}

const BBO_scaleFactor = (scale) => Math.floor(this / BBO_scDiv)

const BBO_mirrorValue = (scale, a, b) => {
    const k = BBO_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const BBO_updateScale = (scale, dir, a, b) => BBO_mirrorValue(scale, a, b) * dir * BBO_scGap

const drawBBONode = (context, i, scale, w, h) => {
    const gap = h / (nodes + 1)
    const size = gap / BBO_sizeFactor
    context.strokeStyle = BBO_color
    context.fillStyle = BBO_color
    context.lineWidth = Math.min(w, h) / BBO_strokeFactor
    context.lineCap = 'round'
    context.save()
    context.translate(w/2, gap * (i + 1))
    for (var j = 0; j < BBO_BALLS; j++) {
        const sc = BBO_divideScale(scale, j, BBO_BALLS)
        const sc1 = BBO_divideScale(sc, 0, BBO_BALLS)
        const sc2 = BBO_divideScale(sc, 1, BBO_BALLS)
        context.save()
        context.scale(1 - 2 * j, 1 - 2 * j)
        context.save()
        context.translate((w/2 - size) * sc2, 0)
        context.beginPath()
        context.arc(0, 0, size, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        for(var k = 0; k < 2; k++) {
            context.save()
            context.translate(size, -size)
            context.rotate((Math.PI/2 + Math.PI/2 * sc1) * k)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(-size, 0)
            context.stroke()
            context.restore()
        }
        context.restore()

    }
    context.restore()
}

class LinkedBallBoxOpenStage extends CanvasStage {
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
        const stage = new LinkedBallBoxOpenStage()
        stage.render()
        stage.handleTap()
    }
}

class BBOState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += BBO_updateScale(this.scale, this.dir, BBO_LINES, BBO_LINES)
        if (Math.abs(this.scale - this.prevScale) > 0) {
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
