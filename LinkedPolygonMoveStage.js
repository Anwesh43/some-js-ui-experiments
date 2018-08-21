const PM_NODES = 5
const drawPMNode = (context, i, scale, w, h, cb, useI) => {
    const gap = Math.min(w, h) / (PM_NODES + 1)
    const deg = (2 * Math.PI) / PM_NODES
    const size = gap / 2
    const a = size / Math.cos(deg / 2)
    var location = gap * i + gap / 2 + gap * scale
    if (!useI) {
        location = 0 
    }
    context.lineWidth = Math.min(w, h)
    context.lineCap = 'round'
    context.strokeStyle = '#388E3C'
    context.save()
    context.translate(location, location)
    if (cb) {
        cb()
    }
    context.save()
    context.rotate(deg * i)
    context.beginPath()
    context.moveTo(-size / 2, a)
    context.lineTo(size / 2, a)
    context.stroke()
    context.restore()
    context.restore()
}
class LinkedPolygonMoveStage {
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
        const stage = new LinkedPolygonMoveStage()
        stage.render()
        stage.handleTap()
    }
}

class PMState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += this.dir * 0.1
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

class PMAnimator {
    constructor() {
        this.animated = false
    }

    start(cb){
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
