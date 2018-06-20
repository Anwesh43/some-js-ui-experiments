const LBG_NODES = 5
class LinkedBarGraphStage extends CanvasStage {
    constructor() {
        super()
        this.lbg = new LinkedBarGraph()
        this.animator = new LBGAnimator()
    }

    render() {
        super.render()
        if (this.lbg) {
            this.lbg.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.lbg.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lbg.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class LBGState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
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

class LBGAnimator {
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

class LBGNode {
    constructor(i) {
        this.i = i
        this.state = new LBGState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LBG_NODES - 1) {
            this.next = new LBGNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = (w/2)/(LBG_NODES), hGap = (h/2)/(LBG_NODES), hBar = (this.i * hGap) * this.state.scale
        context.fillStyle = '#3498db'
        context.save()
        context.translate(w/2 + this.i * gap, h/2)
        context.fillRect(0, -hBar, gap, hBar)
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

class LinkedBarGraph {
    constructor() {
        this.curr = new LBGNode(0)
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
