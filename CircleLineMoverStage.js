class CircleLineMoverStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new CircleLineAnimator()
        this.circleLine = new CircleLineMover(this.size.w/2, this.size.h/2, Math.min(this.size.w, this.size.h)/15)
    }
    render() {
        super.render()
        if(this.circleLine) {
            this.circleLine.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX
            this.circleLine.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.circleLine.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class CircleLineAnimator {
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
class CircleLineState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.scales = [0,0]
            this.dir = 1
            startcb()
        }
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(this.scales[this.j] > 1) {
            this.scales[this.j] = 1
            if(this.j == this.scales.length) {
                this.dir = 0
                this.j = 0
                stopcb()
            }
        }
    }
}
class CircleLineMover {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = new CircleLineState()
        this.dir = 0
    }
    drawArc(context, startDeg, endDeg) {
        context.beginPath()
        for(var i = startDeg; i <= endDeg; i++) {
            const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
            if(i == 0) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.stroke()
    }
    drawLine(context, x1, x2) {
      context.beginPath()
      context.moveTo(x1, 0)
      context.lineTo(x2, 0)
      context.stroke()
    }
    draw(context) {
        const r = this.size/2
        const scales = this.state.scales
        context.save()
        context.translate(this.x, this.y)
        this.drawArc(context, 0, 360 * (1 - scales[0]))
        this.drawLine(context, r + (2 * Math.PI * r - r) * scales[1], r + (2 * Math.PI * r - r) * scales[0])
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.x += this.dir * 2 * Math.PI * (this.size/2)
            this.dir = 0
            stopcb()
        })
    }
    startUpdating(dir, startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.state.startUpdating(startcb)
        }
    }
}
const initCircleLineMoverStage = () => {
    const stage = new CircleLineMoverStage()
    stage.render()
    stage.handleTap()
}
