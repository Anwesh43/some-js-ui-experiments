class LineBallStage extends CanvasStage {
    constructor() {
        super()
        this.lineBall = new LineBall(this.size.w, this.size.h)
        this.animator = new LBAnimator()
    }
    render() {
        super.render()
        if(this.lineBall) {
            this.lineBall.draw(this.context)
        }
    }
    handleKeyDown() {
        window.onkeydown = (event) => {
            var dir = event.keyCode - 38
            if(Math.abs(dir) == 1) {
                this.lineBall.startUpdating(dir, () => {
                    this.animator.start(() => {
                        this.lineBall.update(() => {
                            this.animator.stop()
                        })
                    })
                })
            }
        }
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
        const color = 'orange'
        const r = this.gap/10
        context.strokeStyle = color
        context.fillStyle = color
        context.lineWidth = r * 0.1
        context.lineCap = 'round'
        this.x = this.px + this.gap * scales[2] * this.dir
        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        context.moveTo(0,0)
        const y_updated = -this.y_gap * (1 - scales[0])
        context.lineTo(0, y_updated)
        context.stroke()
        context.beginPath()
        const r_updated = r * 0.1 + (r * 0.9) * scales[1]
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
    startUpdating(dir, startcb) {
        this.dir = dir
        this.state.startUpdating(() => {
            startcb()
        })
    }
}
const initLineBallStage = () => {
    const stage = new LineBallStage()
    stage.render()
    stage.handleKeyDown()
}
