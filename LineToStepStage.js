class LineToStepStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class LineToStepState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.dir = 0
            this.scale = this.prevScale + this.dir
            stopc
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}

class LineToStepAnimator {

    constructor () {
        this.animated = false
    }

    start (updatecb) {
        if (!this.animated) {
            this.anmimated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop () {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LinkedLineStep {
    constructor(i) {
       this.i = i

    }
    addNext(next) {
        this.next = next
    }
    draw(context, w, h, scale) {
        const y = h/3 + (2*h/3 - (this.i * w) - h/3) * scale
        context.beginPath()
        context.moveTo(i*w, y)
        context.lineTo(i*w + w, y)
        context.stroke()
        if (this.next) {
            context.beginPath()
            context.moveTo(i*w+w, y)
            context.lineTo(i * w + w, y - (w/3) * scale)
        }
    }
}
