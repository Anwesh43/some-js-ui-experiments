class SquareBallStage extends CanvasStage {
    constructor() {
        super()
        this.squareBall = new SquareBallS()
        this.animator = new SquareBallAnimator()
    }
    render() {
        super.render()
        if (this.squareBall) {
            this.squareBall.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.squareBall.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.squareBall.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class SquareBallState {
    constructor() {
        this.scales = [0, 0, 0, 0, 0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
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
            this.dir = 1 - 2 * this.prevSale
            startcb()
        }
    }
}

class SquareBallAnimator {
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

class SquareBall {
    constructor() {
        this.state = new SquareBallState()
    }
    draw(context, w, h) {
        context.save()
        context.translate(w/2, h/2)
        const sizeX = (Math.min(w, h)/3) * this.state.scales[0], sizeY = Math.min(w,h)/3 * this.state.scales[2]
        for (var i = 0; i < 2; i++) {
            context.save()
            context.rotate(Math.PI/2 * i * this.state.scales[1])
            for (var j = 0; j < 3; j++) {
                context.save()
                context.beginPath()
                context.moveTo(-sizeX, sizeY)
                context.lineTo(sizeX, sizeY)
                context.stroke()
                context.restore()
            }
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
const initSquareBallStage = () => {
    this.stage = new SquareBallStage()
    this.stage.render()
    this.stage.handleTap()
}
