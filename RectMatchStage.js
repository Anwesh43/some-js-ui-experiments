class RectMatchStage extends CanvasStage {
    constructor() {
        super()
        this.rectMatch = new RectMatch()
        this.animator = new RMSAnimator()
    }
    render () {
        super.render()
        if (this.rectMatch) {
            this.rectMatch.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap () {
        this.canvas.onmousedown = () => {
            this.rectMatch.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.rectMatch.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class RMSState {
    constructor () {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.prevScale - this.scales[this.j]) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class RMSAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class RectMatch {
    constructor() {
        this.state = new RMSState()
    }
    draw(context, w, h) {
        const rw = w/15, rh = w/15
        context.strokeStyle = 'white'
        context.lineWidth = Math.min(w,h) / 60
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, h/2)
        context.rotate(Math.PI/2 * this.state.scales[1])
        for (var i = 0; i < 2; i++) {
            const x = ((w/2 + context.lineWidth) * (1 - this.state.scales[0]) + (h/2 + context.lineWidth) * this.state.scales[2]) * (1 - 2*i)
            context.save()
            context.translate(x, 0)
            context.beginPath()
            context.moveTo(0, -rh)
            context.lineTo(rw * (1 - 2 * i), -rh)
            context.lineTo(rw * (1 - 2 * i), rh)
            context.lineTo(0, rh)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initRectMatchStage = () => {
    const rectMatchStage = new RectMatchStage()
    rectMatchStage.render()
    rectMatchStage.handleTap()
    window.scrollTo(0, rectMatchStage.canvas.offsetTop)
}
