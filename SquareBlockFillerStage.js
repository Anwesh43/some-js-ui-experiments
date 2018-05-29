class SquareBlockFillerStage extends CanvasStage {

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

class SBFState {

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

class SBFAnimator {

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
            this.animated = true
            clearInterval(this.interval)
        }
    }
}

class SBFNode {

    constructor(cbs) {
        this.cb = this.cbs[0]
        cbs.splice(0, 1)
        this.state = new SBFState()
        this.addNeighbor(cbs)
    }

    addNeighbor(cbs) {
        if (cbs.length > 0) {
            this.next = new SBFNode(cbs)
            this.next.prev = this
        }
    }

    draw(context) {
        this.cb(context, this.state.scale)
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
