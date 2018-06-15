const LDR_NODES = 5

class LinkedDotRectExpanderStage extends CanvasStage {

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

class LDRState {
    constructor() {
        this.deg = 0
        this.dir = 0
        this.prevDeg = 0
        this.scale = 0
    }

    update(stopcb) {
        this.deg += Math.PI/10
        this.scale = Math.sin(this.deg)
        if (Math.abs(this.deg - this.prevDeg) > Math.PI/2) {
            this.deg = this.prevDeg + this.dir * this.Math.PI/2
            this.scale = Math.sin(this.deg)
            this.dir = 0
            this.prevDeg = 0
            stopcb)
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * Math.floor(prevDeg / (Math.PI/2))
            startcb()
        }
    }
}

class LDRAnimator {
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

class LDRNode {
    constructor(i) {
        this.i = i
        this.state = new LDRState()
        this.addNeighbor
    }

    addNeighbor() {
        if (this.i < LDR_NODES - 1) {
            this.next = new LDRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / LDR_NODES
        const index = this.i % 2
        const scale = index + (1 - 2 * index) * this.state.scale
        context.fillStyle = 'white'
        context.save()
        context.translate(this.i * gap + (gap/2), h/2)
        for (var i = 0; i < 9; i++) {
            const x = gap/2 + (i%3 * (gap/2) + gap/10), y = (gap/2) + (Math.floor(i/3)) * gap/2 + gap/10
            context.save()
            context.translate((gap/2) + (x - gap/2) * scale, (gap/2) - (y - gap/2) * scale)
            context.fillRect(-gap/10, -gap/10, gap/5)
            context.restore()
        }
        context.restore()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.update(startcb)
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
