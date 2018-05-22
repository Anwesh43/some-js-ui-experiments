const TSC_NODES = 5

class TranslatingShrinkingCircleStage extends CanvasStage {

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

class TSCState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class TSCAnimator {

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


class TSCNode {

    constructor(i) {
        this.state = new TSCState()
        if (i) {
            this.i = i
        }
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < TCS_NODES - 1) {
            this.next = new TSCNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = (w/TCS_NODES)
        context.fillStyle = '#c0392b'
        context.save()
        context.translate(this.i * gap, h/2)
        context.beginPath()
        context.arc(gap * this.state.scales[1], 0, (gap/10) * (1 - this.state.scales[1]) * (this.state.scales[0]), 0, 2 * Math.PI)
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
        if (this.dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}
