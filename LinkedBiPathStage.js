const LBP_NODES = 5

const drawSemiCircle = (context, r, start) {
    context.beginPath()
    for (var i = start; i <= start + 180; i++) {
        const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
        if (i == start) {
            context.moveTo(x, y)
        }
        else {
            context.lineTo(x, y)
        }
    }
    context.fill()
}

class LinkedBiPathStage extends CanvasStage {
    constructor() {
        super()
        this.lbp = new LinkedBiPath()
        this.animator = new LBPAnimator()
    }

    render() {
        super.render()
        if (this.lbp) {
            this.lbp.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lbp.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lbp.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class LBPState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
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

class LBPAnimator {
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

class LBPNode {
    constructor(i) {
        this.i = i
        this.state = new LBPState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LBP_NODES) {
            this.next = new LBPNode(this.i + 1)
            this.prev.next = this
        }
    }

    draw(context, w, h) {
        const gap = w / LBP_NODES
        const r = gap / LBP_NODES
        context.save()
        context.translate(this.i * gap + r, h/2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.translate((gap - r) * this.state.scales[i], 0)
            drawSemiCircle(context, r, -90 * (1 - 2 * i))
            context.restore()
        }
        context.beginPath()
        for (var i = 0; i < 2; i++) {
            if (i == 0) {
                context.moveTo((gap - r) * this.state.scales[i], 0)
            } else {
                context.lineTo((gap - r) * this.state.scales[i], 0)
            }
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

class LinkedBiPath {
    constructor() {
        this.curr = new LBPNode(0)
        this.dir = 1
    }

    draw(context, w , h) {
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
