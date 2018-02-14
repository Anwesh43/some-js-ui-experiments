class NShapeStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class NSSAnimator {
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
        }
    }
}
class NSSState {
    constructor() {
        this.scales = [0,0,0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir *= -1
                this.prevScale = this.scales[this.j]
                if(this.j == 0) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
