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
        if (!this.x && !this.y) {
            this.dx = this.x
            this.dy = this.y
            this.ox = this.dx
            this.oy = this.dy
            this.rotX = 0
            this.rotY = 0
        }
        context.strokeStyle = 'white'
        context.lineWidth = Math.min(w, h)/50
        context.lineCap = 'round'
        context.save()
        const updateXY  = (o, d, i) => o + (d - o) * this.state.scales[i]
        context.translate(updateXY(this.ox, this.dx,1), updateXY(this.oy, this.dy, 3))
        context.rotate(this.rotX * this.state.scales[0] + this.rotY * this.state.scales[2])
        const size = Math.min(w,h)/20
        for(var i = 0; i< 2; i++) {
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(-size, (size/2) * (1 - 2 * i))
            context.stroke()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.ox = this.dx
            this.oy = this.dy
            stopcb()
        }, (skipcb) => {
            this.rotY = 0
            if (this.ox != this.dx) {
                this.rotX = (1 - Math.floor((this.dx - this.ox)/Math.abs(this.ox - this.dx))) * (Math.PI/2)
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
            startcb()
        })
    }
}
