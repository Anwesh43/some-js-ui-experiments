class LineBallStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class LineBallState {
    constructor() {
        this.scales = [0,0,0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.size || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                if(this.dir == -1) {
                    this.j += this.dir
                }
                else {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.scales = [0,0,0]
            startcb()
        }
    }
}
class LBAnimator {
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
class LineBall {
    constructor(w,h) {
        this.x = w/20
        this.y = h/2
        this.px = this.x
        this.gap = w/10
        this.y_gap = h/5
        this.state = new LineBallState()
        this.dir = 0
    }
    draw(context) {
        const scales = this.state.scales
        this.x = this.px + this.gap * scales[2]
        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        context.moveTo(0,0)
        const y_updated = -this.y_gap * (1 - scales[0])
        context.lineTo(0, y_updated)
        context.stroke()
        context.beginPath()
        const r_updated = (this.gap/10) * scales[1]
        context.arc(0, y_updated, r_updated, 0, 2*Math.PI)
        context.fill()
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.px = this.x
            stopcb()
        })
    }
    startUpdating(startcb, dir) {
        this.dir = dir
        this.state.startUpdating(() => {
            startcb()
        })
    }
}
