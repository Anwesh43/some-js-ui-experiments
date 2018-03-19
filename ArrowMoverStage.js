class ArrowMoverStage extends CanvasStage {
    constructor() {
        super()
        this.arrowMover = new ArrowMover()
        this.animator = new ArrowMoverAnimator()
    }
    render() {
        super.render()
        if (this.arrowMover) {
            this.arrowMover.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.arrowMover.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.arrowMover.update(() => {
                        this.animator.stop()
                    })
                })
            }, x, y)
        }
    }
}
class ArrowMoverState {
    constructor() {
        this.scales = [0,0,0,0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb,midcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j]) > 1) {
            this.scales[this.j] = this.dir
            this.j++
            if(this.j == 2) {
                midcb(() => {
                    this.j +=2
                })
            }
            if (this.j == this.scales.length) {
                this.j = 0
                this.dir = 0
                this.scales = [0,0,0,0]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            this.j = 0
            startcb()
        }
    }
}
class ArrowMoverAnimator {
    constructor() {
        this.animated = false
    }
    start (updatecb) {
        if (!this.aniamted) {
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
class ArrowMover {
    constructor() {
        this.state = new ArrowMoverState()
    }
    draw(context, w, h) {
        if (!this.ox && !this.oy) {
            this.dx = w/2
            this.dy = h/2
            this.ox = this.dx
            this.oy = this.dy
            this.oRot = 0
            this.dRot = 0
            console.log(`${this.dx} ${this.dy}`)
        }
        context.strokeStyle = 'white'
        context.lineWidth = Math.min(w, h)/50
        context.lineCap = 'round'
        context.save()
        const updateXY  = (o, d, i) => o + (d - o) * this.state.scales[i]
        context.translate(updateXY(this.ox, this.dx,3), updateXY(this.oy, this.dy, 1))
        const updateRotAngle = (i) => this.oRot + (this.dRot - this.oRot) * this.state.scales[i]
        context.rotate(updateRotAngle(Math.floor(this.state.j/2)))
        const size = Math.min(w,h) / 20
        for(var i = 0; i< 2; i++) {
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(-size, (size/2) * (1 - 2 * i))
            context.stroke()
        }
        context.restore()
    }
    getUpdateRot(d,o) {
        return (1 - Math.floor((d - o)/Math.abs(d - o))) * (Math.PI/2)
    }
    update(stopcb) {
        this.state.update(() => {
            this.ox = this.dx
            this.oy = this.dy
            this.oRot = this.dRot
            stopcb()
        }, (skipcb) => {
            this.oRot = this.dRot
            if (this.ox != this.dx) {
                this.dRot = this.getUpdateRot(this.dx, this.ox)
            }
            else {
                skipcb()
            }
        })
    }
    startUpdating(startcb, x, y) {
        this.state.startUpdating(() => {
            this.dx = x
            this.dy = y
            this.dRot = Math.PI/2 + (this.getUpdateRot(this.dy,this.oy))
            startcb()
        })
    }
}
const initArrowMoverStage = () => {
    const arrowMoverStage = new ArrowMoverStage()
    arrowMoverStage.render()
    arrowMoverStage.handleTap()
}
