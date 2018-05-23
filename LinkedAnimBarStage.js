const LAB_NODES = 5
class LinkedAnimBarStage extends CanvasStage {

    constructor() {
        super()
        this.linkedAnimBar = new LinkedAnimBar()
        this.animator = new LABAnimator()
    }

    render() {
        if (this.linkedAnimBar) {
            this.linkedAnimBar.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedAnimBar.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedAnimBar.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class LABState {

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

class LABAnimator {

    constructor() {
        this.animated = false
    }

    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
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

class LABNode {

    constructor(i, cbs) {
        this.i = i
        this.cb = cbs[0]
        this.addNeighbor(cbs)

    }

    addNeighbor(cbs) {
        cbs.splice(0, 1)
        if (cbs.length > 0) {
            this.next = new LABNode(this.i + 1, cbs)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.save()
        context.translate(w/2, h/2)
        this.cb(context, this.state.scale,w, h)
        context.restore()
        if (this.prev) {
            this.prev.draw(context , w, h)
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

class LinkedAnimBar {
    constructor() {
        this.init()
        this.dir = 1
    }

    init() {
        const cbs = []
        cbs.push((context, scale, w, h) => {
            const size = Math.min(w, h) / 3
            context.fillStyle = 'gray'
            context.fillRect(-size * scale, -size * scale, 2 * size * scale, 2 * size * scale)

        })
        cbs.push((context, scale, w, h) => {
            const size = Math.min(w, h) / 3
            context.fillStyle = 'teal'
            context.fillRect(-0.9 * size, -0.8 * size, 0.9 * size, 1.6 * size * scale)
        })
        for (var i = 0; i < 3; i++) {
            cbs.push((context, scale, w, h) => {
                const size = Math.min(w, h) / 3, y = -size,  gap = (2 * size) / 6
                context.lineWidth = Math.min(w, h) / 45
                context.lineCap = 'round'
                context.strokeStyle = 'teal'
                context.beginPath()
                context.moveTo(0.1 * size, y + i * gap)
                context.lineTo(0.1 * size + 0.8 * size * scale, y + i * gap)
                context.stroke()
            })
        }
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
