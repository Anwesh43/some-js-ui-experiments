class SquareMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class SquareMoverState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j]) > 1) {
            this.scales[this.j]  = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length) {
                this.dir = 0
                this.j = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.scales = [0, 0]
        }
    }
}
class SquareMoverAnimator {
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
class SquareMover {
    constructor(w, h) {
        this.dir = 0
        this.x = w/2
        this.y = h/2
        this.size = Math.min(w,h)/15
        this.state = new SquareMoverState()
    }
    draw(context) {
        context.fillStyle = 'teal'
        context.strokeStyle = 'teal'
        context.lineWidth = Math.min(w,h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(this.x, this.y)
        const size_updated = this.size * (1 - this.state.scales[0])
        const square2_size = this.size * (this.state.scales[1])
        context.fillRect(-size_updated/2, -size_updated/2, size_updated, size_updated)
        const x1 = 4 * this.size * this.state.scales[0], x = 4 * this.size * this.state.scales[1]
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x1, 0)
        context.stroke()
        context.fillRect(4 * this.size - square2_size/2, -square2_size/2, square2_size, square2_size)
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.x += 4*this.size * this.dir
            this.dir = 0
        })
    }
    startUpdating(dir, startcb) {
        if(this.dir == 0) {
            this.dir = dir
            this.state.startUpdating(startcb)
        }
    }
}
