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
        console.log(this.scale)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
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
            this.interval = setInterval(() => {
                updatecb()
            }, 120)
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
        context.fillStyle = 'black'
        context.beginPath()
        context.arc(0, 0, r * this.state.scale, 0, 2 * Math.PI)
        context.fill()
        const x_gap = r/5
        var x = -9 * r + 9 * r * this.state.scale
        context.strokeStyle = 'white'
        context.lineCap = 'round'
        context.lineWidth = x_gap/6
        context.save()
        context.beginPath()
        context.rect(-r, 0, 2 * r, r)
        context.clip()
        for (var i = 0; i < 50; i++) {
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

const initRailLineStage = () => {
    this.railLineStage = new RailLineStage()
    this.railLineStage.render()
    this.railLineStage.handleTap()
}
