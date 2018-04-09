class RailLineStage extends CanvasStage{
    constructor () {
        super()
        this.line = new RailLine()
        this.animator = new RailLineAnimator()
    }
    render () {
      super.render()
      if (this.line) {
          this.line.draw(this.context, this.size.w, this.size.h)
      }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.line.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.line.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class RailLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
(
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class RailLineAnimator {
    constructor () {
        this.animated = false
    }

    start (updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = clearInterval(() => {
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

class RailLine {
    constructor () {
        this.state = new RailLineState()
    }
    draw (context, w, h) {
        const r = Math.min(w, h)/6
        context.save()
        context.translate(w/2, h/2)
        context.fillStyle = '#95a5a6'
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = '#212121'
        context.beginPath()
        context.arc(0, 0, r * this.state.scale, 0, 2 * Math.PI)
        context.fill()
        const x_gap = r/5
        var x = -3 * r + 3 * r * this.state.scale
        context.save()
        context.beginPath()
        context.rect(0,h/2,w,h/2)
        context.clipPath()
        for (var i = 0; i < 20; i++) {

            context.beginPath()
            context.moveTo(x * Math.cos(Math.PI/3), x * Math.sin(Math.PI/3))
            context.lineTo(x * Math.cos(2 * Math.PI/3), x * Math.sin(2 * Math.PI/3))
            context.stroke()
            x += x_gap
        }
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

const initRailLine = () => {
    this.railLineStage = new RailLineStage()
    this.railLineStage.render()
    this.railLineStage.handleTap()
}
