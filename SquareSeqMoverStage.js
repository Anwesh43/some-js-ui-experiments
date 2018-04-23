const MAX_SEQ_SQUARE = 5
class SquareSeqMoverStage extends CanvasStage {

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

class SSMState {

    constructor(n) {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
        this.k = 0
        this.n = n
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.j += this.dir
            this.scales[this.j] = this.prevScale + this.dir
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

class SSMAnimator {

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

class SquareSeqNode {
    constructor(i) {
        this.state = new SSMState()
        if (!i) {
            this.i = 0
        }
        else {
            this.i = i
        }
    }

    addNeighbor() {
        if (this.i < N - 1) {
            const NODE = new SquareSeqNode(this.i + 1)
            this.next = NODE
            NODE.prev = this
            NODE.addNeighbor()
        }
    }

    draw(context, w, h) {
        const size = w/N
        const x1 = this.i * size + size * this.state..scales[1], x2 = this.i * size + size * this.state.scales[0], y1 = h/2 - size/2, y2 = h/2 + size/2
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y1)
        context.lineTo(x2, y2)
        context.lineTo(x1, y2)
        context.lineTo(x1, y1)
        context.stroke()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
