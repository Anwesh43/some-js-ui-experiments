class TriToSineWaveStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new TriToSineAnimator()
        this.triToSineWave = new TriToSineWave()
    }
    render() {
        super.render()
        if (this.triToSineWave) {
            this.triToSineWave.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.triToSineWave.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.triToSineWave.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
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
            }, 100)
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
        var x = 0, factor = 38 * this.state.scale
        for(var i = 0; i <= n * Math.PI; ) {
            context.lineTo(x, -(h/3) * Math.sin(i))
            i += (Math.PI/(2+factor))
            x += (x_gap/(1+ factor/2))
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

const initTriToSineWaveStage = () => {
    const stage = new TriToSineWaveStage()
    stage.render()
    stage.handleTap()
}
