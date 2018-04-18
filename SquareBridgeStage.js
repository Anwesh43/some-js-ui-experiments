class SquareBridgeStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new SQSAnimator()
        this.bridge = new SquareBridge()
    }
    render() {
        super.render()
        if (this.bridge) {
            this.bridge.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.bridge.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.bridge.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class SQSState {
    constructor () {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == -1 || this.j == this.scales.length) {
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

class SQSAnimator {
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

class SquareBridge {
    constructor() {
        this.state = new SQSState()
    }
    draw(context, w, h) {
        const size = Math.min(w, h)/6
        context.strokeStyle = '#e74c3c'
        context.fillStyle = '#e74c3c'
        context.lineWidth = Math.min(w, h)/45
        context.lineCap = 'round'
        context.save()
        context.translate(w/2, h/2)
        const px = [], py = []
        for (var i = 0; i < 2; i++) {
            const sx = (size/2) * this.state.scales[1] * (1 - 2 * i)
            context.globalAlpha = 1 - 0.5 * i
            context.save()
            context.translate(-sx, sx)
            context.fillRect(-size, -size, 2 * size, 2 * size)
            context.restore()
            const sizeScaled = (size - Math.min(w,h)/90) * this.state.scales[2]
            px.push([-sx - sizeScaled, -sx + sizeScaled, -sx - sizeScaled, -sx + sizeScaled])
            py.push([sx - sizeScaled, sx + sizeScaled, sx + sizeScaled, sx - sizeScaled])
        }
        context.globalAlpha = 1
        for(var i = 0 ; i < 4;i++) {
            context.beginPath()
            context.moveTo(px[0][i], py[0][i])
            context.lineTo(px[1][i], py[1][i])
            context.stroke()
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

const initSquareBridgeStage = () => {
    const stage = new SquareBridgeStage()
    stage.render()
    stage.handleTap()
}
