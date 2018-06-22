const SR_NODES = 5

class LinkedStepRotLineStage extends CanvasStage {

    constructor() {
        super()
        this.lsr = new LinkedStepRotLine()
        this.animator = new SRAnimator()
    }

    render() {
        super.render()
        if (this.lsr) {
            this.lsr.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.lsr.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lsr.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class SRState {
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

class SRAnimator {
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


class SRNode {

    constructor(i) {
        this.i = i
        this.state = new SRState()

    }

    addNeighbor() {
        if (this.i < SR_NODES - 1) {
            this.next = new SRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const index = (this.i % 2), factor = 2 * index - 1
        const size = Math.min(w, h) / SR_NODES
        const x = size + size * Math.floor((this.i + 1)/2), y = size + h - size * (Math.floor(this.i / 2))
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        context.save()
        context.translate(x, y)
        context.rotate(0.5 * Math.PI * factor * this.state.scale)
        context.beginPath()
        context.moveTo(-size * index, 0)
        context.lineTo(0, size * (1 - index))
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

class LinkedStepRotLine {
    constructor() {
        this.curr = new SRNode()
        this.dir = 1
    }

    draw(context, w, h) {
        context.strokeStyle = '#283593'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(()= >{
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
