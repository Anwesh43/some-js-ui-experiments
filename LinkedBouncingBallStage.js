const B2_NODES = 5
class LinkedBouncingBallStage extends CanvasStage {
    constructor() {
        super()
        this.linkedBouncingBall = new LinkedBouncingBall()
        this.animator = new B2Animator()
    }

    render() {
        super.render()
        if (this.linkedBouncingBall) {
            this.linkedBouncingBall.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedBouncingBall.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedBouncingBall.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedBouncingBallStage()
        stage.render()
        stage.handleTap()
    }
}

class B2State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.05 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class B2Animator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class B2Node {
    constructor(i) {
        this.i = i
        this.state = new B2State()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < B2_NODES - 1) {
            this.next = new B2Node(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.fillStyle = '#d32f2f'
        const hGap = (h * 0.9) / (B2_NODES + 1)
        const r = hGap / 3
        const origY = (0.95 * h - r - hGap * (this.i + 1))
        const diffY = h - origY
        const sc1 = Math.min(0.5, this.state.scale) * 2
        const sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2
        context.save()
        context.translate(0, origY)
        context.save()
        context.translate(r + (w - 2 * r) * (1 - this.state.scale), diffY * sc1 - diffY * sc2)
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
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

class LinkedBouncingBall {
    constructor() {
        this.root = new B2Node(0)
        this.curr = this.root
        this.dir = 1
    }

    draw(context, w, h) {
        this.root.draw(context, w, h)
    }

    update(cb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}
