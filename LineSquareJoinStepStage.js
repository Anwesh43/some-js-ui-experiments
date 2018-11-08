const LSJS_NODES = 5
const LSJS_LINES = 4

const LSJS_divideScale = (scale, n, i) => Math.min(1/n, Math.max(0, scale - 1/n * i)) * n

const LCJS_GAP = 0.05

const LSJS_scaleFactor = (scale) => Math.floor(scale / 0.5)

const LCJS_updateScale = (scale, dir) =>  {
    const k = LSJS_scaleFactor(scale)
    return LCJS_GAP * dir * (k + (1 - k) / LCJS_LINES)
}

class LineSquareJoinStepStage extends CanvasStage {
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
        const stage = new LineSquareJoinStepStage()
        stage.render()
        stage.handleTap()
    }
}

class LSJSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += LCJS_updateScale(this.scale, this.dir)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.prevScale = 1 - 2 * this.dir
            cb()
        }
    }
}

class LSJSAnimator {
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

const drawLSJSNode = (context, i, scale, w, h) => {
    const gap = w / nodes
    const size = gap / 4
    const gapSize = (2 * size) / LSJS_LINES
    const sc1 = LBSS_divideScale(this.state.scale, 2, 0)
    const sc2 = LBSS_divideScale(this.state.scale, 2, 1)
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / 60
    context.strokeStyle = '#01579B'
    context.save()
    context.translate(gap + this.i * gap, h/2)
    for(var i = 0; i < LSJS_LINES; i++) {
        const sSize = gapSize * (i + 1)
        const currSize = sSize + (dSize - sSize) * sc2
        const sc = LBSS_divideScale(sc1, LSJS_LINES, i)
        context.save()
        context.rotate(i * (2 * Math.PI) / lines)
        context.translate(0, currSize)
        context.beginPath()
        context.moveTo(-size, 0)
        context.lineTo(size - 2 * size * sc, 0)
        context.stroke()
        context.restore()
    }
    context.restore()
}

class LSJSNode {
    constructor(i) {
        this.i = i
        this.state = new LSJSState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LSJS_NODES - 1) {
            this.next = new LSJSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        drawLSJSNode(context, this.i, this.state.scale, w, h)
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.stat
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
