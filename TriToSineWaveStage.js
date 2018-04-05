class TriToSingeWaveStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class TriToSineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
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
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}

class TriToSineAnimator {
    constructor() {
        this.animated = false
    }

    start (updatecb) {
        if (!this.animated) {
            this.animated = true
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
