class ExpandingRoundButtonStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class ERBState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}
class ERBAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            setInterval(() => {
              updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = true
            clearInterval(this.interval)
        }
    }
}
