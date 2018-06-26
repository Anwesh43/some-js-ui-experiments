class LinkedDecreasingArrowStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {

        }
    }
}

class DAState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir
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

class DAAnimator {
    contructor() {
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

const DA_NODES = 5

class DANode {

    constructor(i) {
        this.i = i
        this.state = new DAState()
    }

    draw(context, w, h) {
        const wGap = w / DA_NODES
        const size = (wGap / DA_NODES)
        const sizeUpdated = size * this.i + size * this.state.scale
        context.save()
        context.translate(this.i * wGap + wGap * this.state.scale, h/2)
        context.beginPath()
        context.moveTo(-sizeUpdated, -sizeUpdated)
        context.lineTo(-sizeUpdated, sizeUpdated)
        context.stroke()
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
            return this
        }
        cb()
        return this
    }
}
