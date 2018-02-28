class ProgressBarStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class State {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] > this.prevScale)) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.prevScale = this.scales[this.j]
                this.dir = 0
                stopcb()
            }
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
            clearInteral(this.interval)
        }
    }
}
class ProgressBar {
    constructor(i) {
        this.i = i
    }
    drawProgressBar(context, scale, size) {

    }
    draw(context, state, size) {
        const scales = state.scales
        drawProgressBar(context, scales[this.i], size)
    }
}
class LinearProgressBar extends ProgressBar{
    constructor() {
        super(0)
    }
    drawProgressBar(context, scale, size) {
        context.lineWidth = this.size/30
        context.lineCap = 'round'
        context.strokeStyle = ''
        context.save()
        context.translate(0, size/2 + this.i * size)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, size * scale)
        context.stroke()
        context.restore()
    }
}
