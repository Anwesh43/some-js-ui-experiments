const RR_NODES = 10
class LinkedRectangleReducingStage extends CanvasStage {
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
}

class RRState {
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

class RRAnimator {
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

class RRNode {
    constructor(i) {
        this.i = i
        this.state = new RRState()
        this.addNeighbor()
    }
    addNeighbor() {
        if (this.i < RR_NODES - 1) {
            this.next = new RRNode(this.i + 1)
            this.next.prev = this
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        const gap = Math.min(w,h)/3 / RR_NODES
        context.save()
        context.translate(gap * this.i, h - gap/20 - this.i * context.lineWidth)
        context.beginPath()
        context.moveTo((this.i) * gap * this.state.scale, 0)
        context.lineTo((this.i + 1) * gap * this.state.scale, 0)
        context.stroke()
        context.restore()
        if (this.next) {
            this.next.draw(this.context, w, h)
        }
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

class ReducingRectangle {
    constructor() {
        this.curr = new RRNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        context.strokeStyle = '#BF360C'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 15
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.state.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }
}
