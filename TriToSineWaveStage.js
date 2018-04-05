class TriToSingeWaveStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class TriToSineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update (stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}

class TriToSineAnimator {
    constructor() {
        this.animated = false
    }

    start (updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop () {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class TriToSineWave {
    constructor () {
        this.state = new TriToSineState()
    }
    draw(context, w, h) {
        const n = 12
        const x_gap = w / (2 * n)
        context.strokeStyle = '#c0392b'
        context.lineWidth = Math.min(w, h) / 50
        context.lineCap = 'round'
        context.save()
        context.translate(0, h/2)
        context.beginPath()
        context.moveTo(0, 0)
        var x = 0, factor = 18 * this.state.scale
        for(var i = 0; i <= n * Math.PI; ) {
            context.lineTo(x, -Math.sin(i))
            i += (Math.PI/(2+factor))
            x += (x_gap/factor)
        }
        context.stroke()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
