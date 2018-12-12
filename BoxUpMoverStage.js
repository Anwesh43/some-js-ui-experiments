const BUMN_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

class BoxUpMoverStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

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
        this.scale += 0.01 * this.dir
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

    start() {
        if (!this.animated) {
            this.animated = true
            this.interval = setInverval(cb, 50)
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
        this.k = 0
    }

    draw(context, w, h) {
        const scale = this.state.scale
        const hSize = Math.max(w, h) /  5
        const wSize = Math.min(w, h) / 5
        var sc = BUMN_divideScale(scale, this.k, 10)
        const sf = this.k % 2
        sc = sf * (1 - sc) + (1 - sf) * sc
        const oy = h / 2
        const dy = hSize/2
        context.save()
        context.translate(w/2, oy + (dy - oy) * scale)
        context.fillRect(-wSize/2, -hSize/2, wSize, hSize)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.translate(0, hSize/2)
            context.rotate(Math.PI/6 * sc * (1 - 2 * i))
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, hSize/3)
            context.restore()
        }
        context.restore()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }
}
