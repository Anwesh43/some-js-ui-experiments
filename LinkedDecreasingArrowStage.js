class LinkedDecreasingArrowStage extends CanvasStage {
    constructor() {
        super()
        this.da = new DecreasingArrow()
        this.animator = new DAAnimator()
    }

    render() {
        super.render()
        if (this.da) {
            this.da.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.da.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.da.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class DAState {
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

class DAAnimator {
    contructor() {
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

const DA_NODES = 5

class DANode {

    constructor(i) {
        this.i = i
        this.state = new DAState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < DA_NODES - 1) {
            this.next = new DANode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        if (this.prev) {
            this.prev.draw(context)
        }
        const wGap = w / DA_NODES
        const size = (wGap / DA_NODES)
        const sizeUpdated = size * this.i + size * this.state.scale
        context.save()
        context.translate(this.i * wGap + wGap * this.state.scale, h/2)
        context.beginPath()
        context.moveTo(-sizeUpdated, -sizeUpdated)
        context.lineTo(0, 0)
        context.lineTo(-sizeUpdated, sizeUpdated)
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
            return this
        }
        cb()
        return this
    }
}

class DecreasingArrow {
    constructor() {
        this.curr = new DANode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        if (this.curr) {
            context.strokeStyle = '#4A148C'
            context.lineCap = 'round'
            context.lineWidth = Math.min(w, h) / 60
            this.curr.draw(context, w, h)
        }
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
