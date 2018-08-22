class RectPartialStage extends CanvasStage {
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

    static init() {
        const stage = new RectPartialStage()
        stage.render()
        stage.handleTap()
    }
}

class RPState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
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

class RPAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class RPNode {
    constructor(i) {
        this.i = i
        this.state = new RPState()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new RPNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        context.strokeStyle = '#FF9800'
        const gap = w / (nodes + 1)
        var sc1 = Math.min(0.5, this.state.scale) * 2
        const sc2 = Math.min(0.5, this.state.scale - 0.5) * 2
        const size = gap / 4
        sc1 = (1 - sc1) * (this.i % 2) + (1 - (this.i % 2)) * sc1
        context.save()
        context.translate(gap * i + gap * sc2, h / 2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.scale(1 - 2 * i, 1)
            context.save()
            context.translate(size/4 * sc1, -size/2)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-size/4, 0)
            context.lineTo(-size/4, size)
            context.lineTo(0, size)
            context.stroke()
            context.restore()
            context.restore()
        }

        context.restore()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
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
