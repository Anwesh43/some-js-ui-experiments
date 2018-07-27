const LAD_NODES = 5
class LinkedAxisDropBallStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new LADAnimator()
        this.linkedAxisDrop = new LinkedAxisDropBall()
    }

    render() {
        super.render()
        if (this.linkedAxisDrop) {
            this.linkedAxisDrop.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedAxisDrop.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedAxisDrop.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedAxisDropBallStage()
        stage.render()
        stage.handleTap()
    }
}

class LADState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.1 * this.dir
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

class LADAnimator {
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

class LADNode {
    constructor(i) {
        this.i = i
        this.state = new LADState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LAD_NODES - 1) {
            this.next = new LADNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.fillStyle = 'yellow'
        const gap = (0.4 * w) / LAD_NODES
        const r = gap / 10
        context.save()
        context.translate(this.i * gap + gap, (h/2 + r) * this.state.scale)
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
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

class LinkedAxisDropBall {
    constructor() {
        this.curr = new LADNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        context.save()
        context.translate(w/2, h/2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.scale(1 - 2 * i, 1)
            this.curr.draw(context, w, h)
            context.restore()
        }
        context.restore()
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
