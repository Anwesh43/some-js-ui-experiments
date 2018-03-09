class TraingleListStage extends CanvasStage {
    constructor() {
        super()
        this.triangleList = new TriangleList(Math.min(this.size.w, this.size.h))
        this.animator = new TriangleListAnimator()
    }
    render() {
        super.render()
        if (this.triangleList) {
            this.triangleList.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.triangleList.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.triangleList.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class TriangleListState {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.j = 0
        this.dir = 0
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
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class TriangleListAnimator {
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
class TriangleList {
    constructor(size) {
        this.size = size
        this.state = new TriangleListState()
    }
    draw(context) {
        const k = 10
        for (var i = 0; i < k; i++) {
            context.save()
            context.translate((i - k/2) * size * this.state.scales[2], 0)
            this.drawTriangle(context)
            context.restore()
        }
    }
    drawTriangle(context) {
        context.save()
        context.translate(0, -this.size)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.rotate(this.state.scales[1] * Math.PI/4)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, size * Math.sqrt(2) * this.state.scales[0])
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
const initTriangleListStage = () => {
    const stage = new TriangelListStage()
    stage.render()
    stage.handleTap()
}
