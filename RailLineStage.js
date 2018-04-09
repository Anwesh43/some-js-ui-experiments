class RailLineStage extends CanvasStage{
    constructor () {
        super()
    }
    render () {
      super.render()
    }
    handleTap() {

    }
}

class RailLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
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

class RailLineAnimator {
    constructor () {
        this.animated = false
    }

    start (updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = clearInterval(() => {
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
