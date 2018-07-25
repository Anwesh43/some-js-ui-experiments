const SIS_NODES = 5
class StepIncreasingStage extends CanvasStage {
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
        const stage = new StepIncreasingStage()
        stage.render()
        stage.handleTap()
    }
}

class SISState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.prevScale - this.scale) > 1) {
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

class SISAnimator {
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

class SISNode {
    constructor(i) {
        this.i = i
        this.state = new SISState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < SIS_NODES - 1) {
            this.next = new SISNode()
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / SIS_NODES
        const hGap = h / SIS_NODES
        context.fillStyle = 'white'
        context.save()
        context.translate(this.i * gap + gap * this.state.scale,  h - hGap * this.i - hGap - hGap * this.state.scale)
        context.fillRect(0, 0, gap, hGap * this.i + hGap + hGap * this.state.scale)
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
