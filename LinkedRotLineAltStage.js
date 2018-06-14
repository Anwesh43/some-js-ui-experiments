const LRL_NODES = 5
class LinkedRotLineAltStage extends CanvasStage {

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

class LRLState {
    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.prevScale - this.scales[this.j]) > 1) {
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

class LRLAnimator {
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

class LRLNode {
    constructor(i) {
        this.i = i
        this.state = new LRLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LRL_NODES - 1) {
            this.next = new LRLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = ((w * 0.9) / LRL_NODES)
        context.strokeStyle = '#27ae60'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        const index = 1 - 2 * (i % 2)
        context.save()
        context.translate(this.i * gap + w/20 + gap * this.state.scales[1], h/2)
        context.rotate(-Math.PI * index + Math.PI * this.state.scales[0] * index)
        context.moveTo(0, 0)
        context.lineTo(0, gap)
        context.stroke()
        context.restore()
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

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
