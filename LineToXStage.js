class LineToXStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class LTXAnimator {
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
class LTXState {
    constructor() {
        this.scales = [0,0,0]
        thsi.dir = 0
        this.j = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[j] - this.prevScale) > 1) {
            this.scales[j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.prevScale = this.scales[this.j]
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.prevScale
            startcb()
        }
    } 
}
