const AANODES = 5
class LinkedArcAxisStage extends CanvasStage {
    constructor() {
        super()
        this.linkedArcAxis = new LinkedArcAxis()
        this.animator = new LAAAnimator()
    }

    render() {
        super.render()
        if (this.linkedArcAxis) {
            this.linkedArcAxis.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedArcAxis.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedArcAxis.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedArcAxisStage()
        stage.render()
        stage.handleTap()
    }
}

class LAAState {
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

class LAAAnimator {
    constructor() {
        this.animated = false
    }

    start() {
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

class LAANode {
    constructor(i) {
        this.i = i
        this.state = new LAAState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < AANODES - 1) {
            this.next = new LAANode(this.i + 1)
            this.next.prev = this
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    draw(context, w, h) {
        const gap = Math.min(w, h)/(3 * AANODES)
        const r = gap/2
        context.save()
        context.translsate(this.i * gap + gap/2, 0)
        context.beginPath()
        for (var i = -60; i<=60; i++) {
            const x = r * Math.cos(i * Math.PI/180), y = r * Math.cos(i * Math.PI/180)
            if (i == -60) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
        this.next.draw(context, w, h)
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

class LinkedArcAxis {
    constructor() {
        this.curr = new LAANode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#006064'
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
        this.curr.startUpdating(cb)
    }
}
