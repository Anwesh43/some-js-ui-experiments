class SquareBridgeStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class SQSState {
    constructor () {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == -1 || this.j == this.scales.length) {
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

class SQSAnimator {
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

class SquareBridge {
    constructor() {
        this.state = new SQSState()
    }
    draw(context, w, h) {
        const size = Math.min(w, h)/6
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < 2; i++) {
            const sx = (size/2) * this.state.scales[1] * (1 - 2 * i)
            context.save()
            context.translate(-sx, sx)
            context.fillRect(-size, -size, 2 * size, 2 * size)
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
