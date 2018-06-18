const LARB_NODES = 5
class LinkedAltBiRotLineStage extends CanvasStage {
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

class LARBSstate {
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

class LARBAnimator {
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

class LARBNode {

    constructor(i) {
        this.state = new LABRState
        this.i = i
    }

    addNeighbor() {
        if (this.i < LARB_NODES - 1) {
            this.next = new LARBNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        const gap = w / LARB_NODES
        context.save()
        context.translate(-gap/120 + gap * i + gap * this.state.scales[0], h/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.translate(0, (gap / 4) * (1 - 2 * i))
            context.rotate(Math.PI/2 * (i + (1 - 2 * i)) * this.state.scales[1])
            context.moveTo(0, -gap/4)
            context.lineTo(0, gap/4)
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
