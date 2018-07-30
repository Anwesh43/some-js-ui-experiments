const TF_NODES = 4, TF_SPEED = 0.025
class LinkedTriFillerStage extends CanvasStage {
    constructor() {
        super()
        this.ltf = new LinkedTriFiller()
        this.animator = new TFAnimator()
    }

    render() {
        super.render()
        if (this.ltf) {
            this.ltf.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lft.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.ltf.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedTriFillerStage()
        stage.render()
        stage.handleTap()
    }
}

class TFState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }

    update(cb) {
        this.scale += TF_SPEED * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }
}

class TFAnimator {
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

class TFNode {
    constructor(i) {
        this.i = i
        this.state = new TFState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < TF_NODES - 1) {
            this.next = new TFNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / TF_NODES, deg = (2 * Math.PI) / TF_NODES
        const sc1 = Math.min(0.5, this.state.scale) * 2
        const sc2 = Math.min(0.5, Math.max(0.5, this.state.scale - 0.5)) * 2
        const size = gap / 3
        context.fillStyle = '#BDBDBD'
        context.save()
        context.translate(gap * sc2, 0)
        if (this.prev) {
            this.prev.draw(context)
        }
        context.save()
        context.translate(this.i * gap + gap/2, h/2)
        context.rotate(this.i * deg)
        context.beginPath()
        context.moveTo(size * (1 - sc1), 0)
        context.lineTo(size, 0)
        context.lineTo(size * (1 - sc1), size * sc1)
        context.fill()
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

class LinkedTriFiller {
    constructor() {
        this.curr = new TFNode(0)
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
