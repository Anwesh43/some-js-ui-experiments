const ATL_NODES = 5
const drawArcToLineNode = (i, scale, w, h) => {
    const sc1 = Math.min(0.5, scale) * 2
    const sc2 = Math.min(0.5, Math.max(0.5, scale - 0.5)) * 2
    const gap = w / (ATL_NODES + 1)
    const r = gap / 4
    const a = r * (1 - sc1)
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / 60
    context.strokeStyle = '#4CAF50'
    context.save()
    context.translate(gap * i + gap / 2 + gap * sc2, h / 2)
    context.beginPath()
    for (var i = 90; i < = 270; i++) {
        const x = a + a * Math.cos(i * Math.PI/180)
        const y = r * Math.sin(i * Math.PI/180)
        if (i == 0) {
            context.moveTo(x, y)
        } else {
            context.lineTo(x, y)
        }
    }
    context.stroke()
    context.restore()
}

class LinkedArcToLineStage extends CanvasStage {
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
        const stage = new LinkedArcToLineStage()
        stage.render()
        stage.handleTap()
    }
}

class ATLState {
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
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class ATLAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(50, cb)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
