const LAB_NODES = 5
class LinkedAnimBarStage extends CanvasStage {

    constructor() {
        super()
    }

    render() {

    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
}

class LABState {

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

class LABAnimator {

    constructor() {
        this.animated = false
    }

    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
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

class LABNode {

    constructor(i, cbs) {
        this.i = i
        this.cb = cbs[0]
        this.addNeighbor(cbs)

    }

    addNeighbor(cbs) {
        cbs.splice(0, 1)
        if (cbs.length > 0) {
            this.next = new LABNode(this.i + 1, cbs)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        this.cb(context, this.state.scale,w, h)
        if (this.prev) {
            this.prev.draw(context , w, h)
        }
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
