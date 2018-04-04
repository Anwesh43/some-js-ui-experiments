const STEP_LINERS = 11

class StepLinerStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class StepLinerState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update (stopcb) {
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

class StepLinerAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.amimated = true
            this.interval = setInterval(() => {

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

class StepLiner {
    constructor(i) {
        this.state = new StepLinerState()
        this.i = i
    }
    draw(context, w, h) {
        const n = Math.floor(STEP_LINERS/2), k = Math.floor((this.i)/n)
        const y_gap = (h / STEP_LINERS + 2), x_gap = (w/STEP_LINERS)
        var i = this.i * (1 - k) + k * (n - this.i)
        const x = (w - x_gap / 2) - (x_gap * i)
        const y = y_gap + (y_gap * this.i)
        context.save()
        context.translate(x, y)
        context.moveTo(-(x_gap/2) * this.state.scale, 0)
        context.lineTo((x_gap/2) * this.state.scale, 0)
        context.stroke()
        context.restore()
    }
    update (stopcb) {
        this.state.update(stopcb)
    }
    startUpdating (startcb) {
        this.state.startUpdating(startcb)
    }
}
