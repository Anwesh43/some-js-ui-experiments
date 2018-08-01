const CMU_NODES = 5
class LinkedCircleUndoMoverStage extends CanvasStage {
    constructor() {
        super()
        this.lcmu = new LinkedCMU()
        this.animator = new CMUAnimator()
    }

    render() {
        super.render()
        if (this.lcmu) {
            this.lcmu.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lcmu.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lcmu.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedCircleUndoMoverStage()
        stage.render()
        stage.handleTap()
    }
}

class CMUState {
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

class CMUNode {
    constructor(i) {
        this.i = i
        this.state = new CMUState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < CMU_NODES - 1) {
            this.next = new CMUNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / CMU_NODES
        const sc1 = Math.min(0.5, this.state.scale) * 2
        const sc2 = Math.min(0.5, Math.max(0, this.state.scale - 0.5)) * 2
        context.strokeStyle = '#0097A7'
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const deg = (2 * Math.PI) / CMU_NODES
        const r = gap /3
        context.save()
        context.translate(gap * sc1, 0)
        context.save()
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        context.translate(this.i * gap + gap / 2, h/2)
        context.rotate()
        context.beginPath()
        for (var i = 0; i <= deg * sc1; i += deg/10) {
            const x = r * Math.cos(i), y = r * Math.sin(i)
            if (i == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
        context.restore()
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

class LinkedCMU {
    constructor() {
        this.curr = new CMUNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
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
        this.state.startUpdating(cb)
    }
}

class CMUAnimator {
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
