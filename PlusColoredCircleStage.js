class PlusColoredCircleStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY

        }
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir *= -1
                this.prevScale = this
                if(this.dir == 1) {
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
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
