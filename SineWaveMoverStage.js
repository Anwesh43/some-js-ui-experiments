class SineWaveMoverStage extends CanvasStage {
    constructor () {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class SWMState {
    constructor (w, h) {
        this.scale = 0
        this.deg = 0
        this.limit = w
        this.amp = h
    }
    update(stopcb) {
        this.deg += 10
        this.scale = this.amp * Math.sin(this.deg * Math.PI/180)
        if (this.deg > this.limit) {
            stopcb()
        }
    }
    execute(cb) {
        cb(this.deg, this.scale)
    }
}

class SWMAnimator {
    constructor () {
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
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
