const PYRAMID_NODES = 5
class LinkedPyramidStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new PyramidAnimator()
        this.linkedPyramid = new LinkedPyramid()
    }

    render() {
        super.render()
        if (this.linkedPyramid) {
            this.linkedPyramid.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedPyramid.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedPyramid.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedPyramidStage()
        stage.render()
        stage.handleTap()
    }
}

class PyramidState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
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

class PyramidAnimator {
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

class PyramidNode {
    constructor(i) {
        this.i = i
        this.state = new PyramidState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < PYRAMID_NODES - 1) {
            this.next = new PyramidNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        const gap = Math.min(w, h) / (2 * PYRAMID_NODES)
        context.strokeStyle = '#673AB7'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        for(var i = 0; i < 2; i++) {
            const factor = 1 - 2 * i
            const x = w/2 - this.i * gap * factor, y = gap / 5 + this.i * gap
            context.save()
            context.translate(x, y)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(this.state.scales[0] * -gap * factor, this.state.scales[0] * gap)
            context.stroke()
            if (i == 0) {
                context.beginPath()
                context.moveTo(-gap, gap)
                context.lineTo(-gap + (2 * gap +  (2 * this.i) * gap) * this.state.scales[1], gap)
                context.stroke()
            }
            context.restore()
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

class LinkedPyramid {
    constructor() {
        this.curr = new PyramidNode(0)
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
