const getAngle = (x, y, x1, y1) => {
    if(x1 == x) {
        return 90
    }
    const deg = Math.atan((y1 - y)/(x1 - x))
    if(y1 > y) {
        if(x1 < x) {
            return 180 - deg
        }
    }
    else {
        if(x1 > x) {
            return 360 - deg
        }
    }
}
class TapCircleMoverStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new TCMAnimator()
        const w = this.size.w, h = this.size.h
        this.mover = new TapCircleMover(w/2, h/2, Math.min(w, h)/5)
    }
    render() {
        super.render()
        if(this.mover) {
            this.mover.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.mover.startUpdating(x, y, () => {
                this.animator.start(() => {
                    this.mover.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class TCMState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(this.scales[this.j] > 1) {
            this.scales[this.j] = 1
            this.j++
            if(this.j == this.scales.length) {
                this.j = 0
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.scales = [0,0]
            startcb()
        }
    }
}
class TCMAnimator {
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
class TapCircleMover {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.state = new TCMState()
        this.deg = 0
    }
    drawArc(context, x, y, start, sweep) {
        context.save()
        context.translate(x, y)
        context.beginPath()
        for(var i = start; i <= start + sweep; i++) {
            const x = this.r * Math.cos(i * Math.PI/180), y = this.r * Math.sin(i * Math.PI/180)
            if(i == start) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.restore()
    }
    draw(context) {
        this.drawArc(context, this.x, this.y, this.deg + 360 * this.state.scales[0], 360 * (1 - this.state.scales[0]))
        const x_proj = Math.cos(this.deg * Math.PI/180), y_proj = Math.sin(this.deg * Math.PI/180)
        const x1 = this.x + (2 * Math.PI * this.r + 2 * this.r) * x_proj, y1 = this.y + (2 * Math.PI * this.r + 2 * this.r) * y_proj
        const sx = this.x + this.r * x_proj, sy = this.y + this.r * y_proj, dx = this.x + (2 * Math.PI * this.r + this.r) * x_proj, dy = this.y + (2 * Math.PI * this.r + this.r) * y_proj
        const updated_point = (i) => {x : sx  + (dx - sx) * this.state.scales[i], y: sy + (dy - sy) * this.state.scales[i]}
        const point1 = updated_point(1), point2 = updated_point(0)
        context.beginPath()
        context.moveTo(point1.x, point1.y)
        context.lineTo(point2.x, point2.y)
        context.stroke()
        this.drawArc(context, x1, y1, 180 - this.deg, 360 * this.state.scales[0])
    }
    update(stopcb) {
        this.state.update(() => {
            this.x += (2 * Math.PI * this.r + 2 * this.r) * Math.cos(this.deg * Math.PI/180)
            this.y += (2 * Math.PI * this.r + 2 * this.r) * Math.sin(this.deg * Math.PI/180)
            stopcb()
        })
    }
    startUpdating(x, y, startcb) {
        if(this.state.dir == 0) {
            this.deg = getAngle(this.x, this.y, x, y)
            startcb()
        }
    }
}
