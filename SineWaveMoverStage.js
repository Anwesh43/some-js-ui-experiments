class SineWaveMoverStage extends CanvasStage {
    constructor () {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}

class SWMState {
    constructor (w, h) {
        this.deg = 0
        this.limit = w
        this.amp = h
    }
    transformX(x) {
        return this.amp * Math.sin((this.deg+x) * Math.PI/180)
    }
    update(stopcb) {
        this.deg += 10
        if (this.deg > this.limit) {
            stopcb()
        }
    }
    execute(cb,x) {
        cb(this.deg, this.transformX(x))
    }
}

class SWMAnimator {
    constructor () {
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
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class SineWaveMover {
    constructor(w, h) {
        this.w = w
        this.h = h
        this.state = new SWMState(this.w, this.h/4)
    }
    draw(context) {
        context.save()
        context.translate(0, this.h/2)
        context.beginPath()
        for (var i = 0; i < 36; i++) {
            if (i == 0) {
                this.state.execute((x,y) => {
                    context.moveTo(x, y)
                }, i*10)
            }
            else {
                this.state.execute((x, y) => {
                    context.lineTo(x, y)
                }, i * 10)
            }
        }
        context.stroke()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
