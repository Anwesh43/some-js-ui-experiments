const SAR_NODES = 5
class SideArrowRotStage extends CanvasStage {
    constructor() {
        super()
        this.sar = new SideRotArrow()
        this.animator = new SARAnimator()
    }

    render() {
        super.render()
        if (this.sar) {
            this.sar.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.sar.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.sar.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class SARState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.prevScale - this.scale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class SARAnimator {
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

class SARNode {
    constructor(i) {
        this.i = i
        this.state = new SARState()
        this.addNeighbor()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating()
    }

    addNeighbor() {
        if (this.i < SAR_NODES) {
            this.next = new SARNode(this.i + 1)
            this.next.prev = this
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

    draw(context, w, h) {
        const index = 1 - 2 * (this.i % 2)
        context.strokeStyle = 'teal'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        const sc1 = Math.min(0.5, this.state.scale) * 2, sc2 = Math.min(0.5, Math.max(0, this.state.scale - 0.5))
        context.save()
        context.translate(i * gap + gap * sc1, h/2)
        context.rotate(Math.PI/4 * index + Math.PI/2 * index * sc2 )
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, -gap/3 * index)
        context.stroke()
        context.restore()
    }
}

class SideRotArrow {
    constructor() {
        this.curr = new SARNode()
        this.dir = 1
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }
}
