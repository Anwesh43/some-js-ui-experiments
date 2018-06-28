const RAML_NODES = 5
class LinkedRotAltMutiLineStage extends CanvasStage {

    constructor() {
        super()
        this.lraml = new LinkedRotAltMultiLine()
        this.animator = new RAMLAnimator()
    }

    render() {
        super.render()
        this.lraml.draw(this.context, this.size.w, this.size.h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lraml.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lraml.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class RAMLState {
    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir
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

class RAMLAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setIntervak(() => {
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

class RAMLNode {
    constructor(i) {
        this.i = i
        this.state = new RAMLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < RAML_NODES) {
            this.next = new RAMLNode()
            this.prev.next = this
        }
    }

    draw(context, w, h) {
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        context.strokeStyle = '#f44336'
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const gap = (w / RAML_NODES
        const deg = Math.PI / 3
        const size = w / (RAML_NODES - 1)
        const index = this.i % 2
        const scale = index + (1 - 2 * index) * this.state.scales[1]
        context.save()
        context.translate(gap * this.i + gap * this.state.scales[0], h/2)
        context.beginPath()
        context.arc(0, 0, size, 0, 2 * Math.PI)
        for (var i = 0; i < 6; i++) {
            context.save()
            context.rotate(i * deg * scale)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(size, 0)
            context.stroke()
            context.restore()
        }
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

class LinkedRotAltMultiLine {
    constructor() {
        this.curr = new RAMLNode(0)
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
