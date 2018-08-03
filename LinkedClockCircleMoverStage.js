const CCM_NODES = 5
class LinkedClockCircleMoverStage extends CanvasStage {
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

class CCMState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(cb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.prevScale - this.scale) > 1) {
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

class CCMAnimator {
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

class CCMNode {
    constructor(i) {
        this.i = i
        this.state = new CCMState()
        this.addNeighbor()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    addNeighbor() {
        if (this.i < CCM_NODES - 1) {
            this.next = new CCMNode(this.i + 1)
            this.next.prev = this
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

    draw(context, w, h) {
        const gap = (Math.min(w, h) * 0.9) / CCM_NODES
        const deg = (2 * Math.PI)
        const sc1 = Math.min(0.5, this.state.scale) * 2
        const sc2 = Math.min(0.5, Math.max(0, this.state.scale - 0.5)) * 2
        const m = this.i * gap + gap / 2 + gap * sc2
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        context.save()
        context.translate(m, m)
        context.rotate(deg * this.i + deg * sc1)
        context.beginPath()
        context.arc(0, 0, gap / 3, 0, 2 * Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, -gap/4)
        context.stroke()
        context.restore()
    }
}
