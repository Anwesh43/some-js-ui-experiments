const CY_NODES = 5

class LinkedCurvedYStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {

    }
}

class CYState {
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
        }
    }
}

class CYAnimator {
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

class CYNode {
    constructor(i) {
        this.i = i
        this.state = new CYState()
    }

    addNeighbor() {
        if (this.i < CY_NODES - 1) {
            this.next = new CYNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        const gap = h / CY_NODES
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#673AB7'
        const r = gap / 6
        context.save()
        context.translate(w/2, h - i * gap - gap * this.state.scale)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, -r)
        context.stroke()
        context.beginPath()
        for (var i = 0; i < 180; i++) {
            const x = r * Math.cos(i * Math.PI / 180), y = -r + r * Math.sin(i * Math.PI / 180)
            if (i == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
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
