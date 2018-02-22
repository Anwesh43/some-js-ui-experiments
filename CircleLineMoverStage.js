class CircleLineMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX
        }
    }
}
class CircleLineAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class CircleLineState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.scales = [0,0]
            this.dir = 1
            startcb()
        }
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(this.scales[this.j] > 1) {
            this.scales[this.j] = 1
            if(this.j == this.scales.length) {
                this.dir = 0
                this.j = 0
                stopcb()
            }
        }
    }
}
