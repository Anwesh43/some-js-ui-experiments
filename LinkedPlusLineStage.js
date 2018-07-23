const LPL_NODES = 5
class LinkedPlusLineStage extends CanvasStage {
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
        const stage = new LinkedPlusLineStage()
        stage.render()
        stage.handleTap()
    }
}

class LPLState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class LPLAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                cb()
            }, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LPLNode {
    constructor(i) {
        this.i = i
        this.state = new LPLState()
        this.addNeighbor()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    getNext(dir, cb) {
        var curr = this.prev
        if (this.dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }

    addNeighbor() {
        if (this.i < LPL_NODES - 1) {
            this.next = new LPLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#00BCD4'
        const gap = (Math.min(w, h) * 0.4) / LPL_NODES
        context.save()
        context.translate(this.i * gap, 0)
        context.moveTo(gap * this.state.scale, 0)
        context.lineTo(gap, 0)
        context.stroke()
        context.restore()
    }
}
