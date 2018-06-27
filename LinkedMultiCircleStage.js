const MCL_NODES = 5
class LinkedMultiCircleStage extends CanvasStage {
    constructor() {
        super()
        this.mcl = new LinkedMultiCircle()
        this.animator = new MCLAnimator()
    }

    render() {
        super.render()
        if (this.mcl) {
            this.mcl.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.mcl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.mcl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    init() {

    }
}

class MCLState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(stopcb) {
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
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class MCLAnimator {
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
        if (!this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class MCLNode {
    constructor(i) {
        this.i = i
        this.state = new MCLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < MCL_NODES - 1) {
            this.next = new MCLNode(this.i + 1)
            this.next.prev = this
        }
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        const hGap = h / Math.pow(2, this.i)
        const wGap = w / MCL_NODES
        const r = Math.min(w, h) / (MCL_NODES * MCL_NODES)
        var y = hGap
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#f44336'
        for(var i = 0;  i < Math.pow(2, this.i); i++) {
            context.save()
            context.translate(this.i * wGap + wGap * this.state.scale, (h/2) + (y - h/2) * this.state.scale)
            context.beginPath()
            context.arc(0, 0, r, 0, 2 * Math.PI)
            context.stroke()
            context.restore()
            y += hGap
        }
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

class LinkedMultiCircle {
    constructor() {
        this.curr = new MCLNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr  = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
