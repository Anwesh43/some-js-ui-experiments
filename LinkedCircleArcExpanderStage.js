const CAE_nodes = 5
const CAE_arcs = 4
const CAE_strokeFactor = 90
const CAE_sizeFactor = 3
const CAE_color = "#311B92"
const CAE_scDiv = 0.51
const CAE_scGap = 0.05
const CAE_point = 15

const CAE_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const CAE_scaleFactor = (scale) => Math.floor(scale / CAE_scDiv)

const CAE_mirrorValue = (scale, a, b) => (1 - CAE_scaleFactor(scale)) / a + CAE_scaleFactor(scale) / b

const CAE_updateScale = (scale, dir, a, b) => CAE_mirrorValue(scale, a, b) * dir * CAE_scGap

const drawCAENode = (context, i, scale, w, h) => {
    const gap = w / (CAE_nodes + 1)
    const sc1 = CAE_divideScale(scale, 0, 2)
    const sc2 = CAE_divideScale(scale, 1, 2)
    context.lineWidth = Math.min(w, h) / CAE_strokeFactor
    context.lineCap = 'round'
    context.strokeStyle = CAE_color
    const size = gap / CAE_sizeFactor
    const r = size / 2
    context.save()
    context.translate(gap * (i + 1), h/2)
    context.rotate(Math.PI/2 * sc2)
    for (var j = 0; j < CAE_arcs; j++) {
        const sc = CAR_divideScale(scale, j, CAE_arcs)
        context.save()
        context.rotate(Math.PI/2 * j)
        for (k = 0; k < 2; k++) {
            context.save()
            context.scale(1, 1 - 2 * k)
            context.beginPath()
            for (var t = -45; t <= 0; t++) {
                var a = r * Math.max((t+CAE_point)/CAE_point, 0) * sc
                const x = (r + a) * Math.cos(t * Math.PI/180)
                const y = (r + a) * Math.sin(t * Math.PI/180)
                if (t == -45) {
                    context.moveTo(x, y)
                } else {
                    context.lineTo(x, y)
                }
            }
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    context.restore()
}

class LinkedCircleArcExpanderStage extends CanvasStage {
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
        const stage = new LinkedCircleArcExpanderStage()
        stage.render()
        stage.handleTap()
    }
}

class CAEState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(cb) {
        this.scale += CAE_updateScale(this.scale, this.dir, CAE_arcs, 1)
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
