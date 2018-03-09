class TriangleListStage extends CanvasStage {
    constructor() {
        super()
        this.triangleList = new TriangleList(Math.min(this.size.w, this.size.h)/10)
        this.animator = new TriangleListAnimator()
    }
    render() {
        super.render()
        if (this.triangleList) {
            this.triangleList.draw(this.context, this.size.w, this.size.h)
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
        this.scales = [0, 0]
        this.prevScale = 0
        this.j = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        console.log(this.scales[this.j])
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
    draw(context, w, h) {
        const size = this.size
        console.log(`${w},${h}`)
        const k = 10
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < k; i++) {
            context.save()
            context.translate((i - k/2) * 2 * size * this.state.scales[1], 0)
            this.drawTriangle(context)
            context.restore()
        }
        context.restore()
    }
    drawTriangle(context) {
        const size = this.size
        context.strokeStyle = '#2980b9'
        context.lineWidth = size / 8
        context.lineCap = 'round'
        context.save()
        context.translate(0, -this.size)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.rotate(this.state.scales[1] * Math.PI/4 * (i*2 -1))
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
    const stage = new TriangleListStage()
    stage.render()
    stage.handleTap()
}
