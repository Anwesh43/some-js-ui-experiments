const LI_NODES = 5
const drawLine = (context, size, color) {
    context.strokeStyle = color
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(0, -size)
    context.stroke()
}
class LinkedLineIncreasingStage extends CanvasStage {
    constructor() {
        super()
        this.lil = new LinkedIncreasingLine()
        this.animator = new LIAnimator()
    }

    render() {
        super.render()
        if (this.lil) {
            this.lil.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lil.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lil.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedLineIncreasingStage()
        stage.render()
        stage.handleTap()
    }
}

class LIState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += this.dir * 0.1
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

class LIAnimator {
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

class LINode {
    constructor(i) {
        this.i = i
        this.state = new LIState()
        this.addNeighbor()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    addNeighbor() {
        if (this.i < LI_NODES - 1) {
            this.next = new LINode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / LI_NODES
        const hSize = (h/3)/LI_NODES
        context.save()
        context.translate(w/2 - gap/2 * this.i * gap, h/2 - hSize/2)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        drawLine(context, hSize * (this.i + 1), '#BDBDBD')
        drawLine(context, hSize * (this.i + 1) * this.state.scale, 'white')
        context.restore()
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

class LinkedIncreasingLine {
    constructor() {
        this.root = new LInode(0)
        this.curr = this.root
        this.dir = 1
    }

    draw(context, w, h) {
        this.root.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}
