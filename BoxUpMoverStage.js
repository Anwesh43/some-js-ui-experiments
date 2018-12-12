const BUMN_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const BUMN_PARTS = 10

class BoxUpMoverStage extends CanvasStage {
    constructor() {
        super()
        this.renderer = new BUMNRenderer()
    }

    render() {
        super.render()
        if (this.renderer)
            this.renderer.render(this.context, this.size.w, this.size.h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage = new BoxUpMoverStage()
        stage.render()
        stage.handleTap()
    }
}

class BUMNState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += (0.1 / BUMN_PARTS) * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class BUMNAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class BUMNShape {
    constructor() {
        this.state = new BUMNState()
        this.deg = 0
    }

    draw(context, w, h) {
        const sp = 1 / BUMN_PARTS
        const scale = this.state.scale
        const hSize = Math.max(w, h) /  10
        const wSize = Math.min(w, h) / 10
        const color = '#2980b9'
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const k = Math.floor(scale/sp)
        var sc = BUMN_divideScale(scale, k, BUMN_PARTS)
        //console.log(Math.floor(scale/sp))
        const sf = k % 2
        sc = sf * (1 - sc) + (1 - sf) * sc
        console.log(sc)
        const oy = h / 2
        const dy = hSize/2
        context.save()
        context.translate(w/2, oy + (dy - oy) * scale)
        context.rotate(this.deg)
        context.fillRect(-wSize/2, -hSize/2, wSize, hSize)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.translate(0, hSize/2)
            context.rotate(Math.PI/6 * sc * (1 - 2 * i))
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, hSize/4)
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(cb) {
        this.state.update(() => {
            this.deg = this.deg == 0? Math.PI : 0
            cb()
        })
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }
}

class BUMNRenderer {
    constructor() {
        this.animator = new BUMNAnimator()
        this.shape = new BUMNShape()
    }

    render(context, w, h) {
        this.shape.draw(context, w, h)
    }

    handleTap(cb) {
        this.shape.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.shape.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
