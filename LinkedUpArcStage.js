const UP_ARC_NODES = 5

class LinkedUpArcStage extends CanvasStage {
    constructor() {
        super()
        this.upArc = new UpArc()
        this.animator = new UpArcAnimator()
    }

    render() {
        super.render()
        if (this.upArc) {
            this.upArc.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.upArc.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.upArc.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedUpArcStage()
        stage.render()
        stage.handleTap()
    }
}

class UPArcState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
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

class UPArcAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                cb()
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

class UPArcNode {
    constructor(i) {
        this.i = i
        this.state = new UPArcState()
    }

    draw(context, w, h) {
        const gap = 0.9 * h / UP_ARC_NODES
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        const deg = 18 * this.i + 18 * this.state.scales[0]
        const r = gap / 5, k = 0
        context.save()
        context.translate(w/2, 0.9 * h - gap * this.i - gap * this.state.scales[1])
        context.beginPath()
        for(var j = 270 - deg; j <= 270 + deg; j++) {
            const x = r * Math.cos(j * Math.PI/180), y = r * Math.sin(j * Math.PI/180)
            if (k == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
            k++
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

    getNext(dir, cb) {
        var curr = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class UpArc {

    constructor() {
        this.curr = new UpArcNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
