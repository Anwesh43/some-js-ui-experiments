const LAD_NODES = 5
class LinkedAxisDropBallStage extends CanvasStage {
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
        const stage = new LinkedAxisDropBallStage()
        stage.render()
        stage.handleTap()
    }
}

class LADState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.1 * this.dir
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

class LADAnimator {
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

class LADNode {
    constructor(i) {
        this.i = i
        this.state = new LADState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LAD_NODES - 1) {
            this.next = new LADNode(this.i + 1)
            this.prev.next = this
        }
    }

    draw(context, w, h) {
        context.fillStyle = 'yellow'
        const gap = w / LAD_NODES
        context.save()
        context.translate(this.i * gap + gap, h/2 * this.state.scale)
        context.beginPath()
        context.arc(0, 0, gap/5, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
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
