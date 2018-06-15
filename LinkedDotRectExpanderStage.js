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
