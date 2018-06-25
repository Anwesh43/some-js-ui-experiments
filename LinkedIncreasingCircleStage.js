class LinkedIncreasingCircleStage extends CanvasStage {

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

class LICState {
    constructor() {
        this.j = 0
        this.dir = 0
        this.scales = [0, 0]
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] = this.dir * 0.1
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

 class ICAnimator {

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

const IC_NODES = 5

 class ICNode {

    constructor(i) {
        this.i = i
        this.state = new ICState()
        this.addNeighbor()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    addNeighbor() {
        if (this.i < IC_NODES - 1) {
            this.next = new ICNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const size = w / (IC_NODES * IC_NODES)
        const gap = w / IC_NODES
        context.strokeStyle = '#4CAF50'
        context.save()
        context.translate(gap * i + (gap) * this.state.scales[0], h/2)
        context.beginPath()
        context.arc(0, 0, (i * size/2) + (size/2) * this.state.scales[1], 0, 2 * Math.PI)
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
 }

class LinkedIncreasingCircle {
    constructor() {
        this.curr = new ICNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
