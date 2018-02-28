const PROGRESS_TO_DO_COLOR = '#95a5a6'
const IN_PROGRESS_COLOR = '#2980b9'
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
    drawShape(context, scale, color, size) {

    }
    drawProgressBar(context, scale, size) {
        context.lineWidth = this.size/30
        context.lineCap = 'round'
        context.save()
        context.translate(0, size/2 + this.i * size)
        this.drawShape(context, 1, PROGRESS_TO_DO_COLOR, size)
        this.drawShape(context, scale, IN_PROGRESS_COLOR, size)
        context.restore()
    }
    draw(context, state, size) {
        const scales = state.scales
        drawProgressBar(context, scales[this.i], size)
    }
}
class LinearProgressBar extends ProgressBar {
    constructor() {
        super(0)
    }
    drawShape(context, scale, color, size) {
        context.strokeStyle = color
        context.beginPath()
        context.moveTo(-size/2, 0)
        context.lineTo(-size/2 + size * scale, 0)
        context.stroke()
    }
}
class CircularProgressBar extends ProgressBar {
    constructor() {
        super(1)
    }
    drawShape(context, scale, color, size) {
        context.beginPath()
        for(var i = 0; i < 360 * scale; i++) {
            const x = (size/4) * Math.cos(i * Math.PI/180), y = (size/4) * Math.sin(i * Math.PI/180)
            if(i == 0) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }
}
class RectProgressBar extends ProgressBar {
    constructor() {
        super(2)
    }
    drawShape(context, scale, color, size) {
        context.fillStyle = color
        context.fillRect(-size/2, -size/2 , size * scale, size)
    }
}
