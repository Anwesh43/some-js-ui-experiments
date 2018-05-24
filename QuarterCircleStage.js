const QC_NODES = 5
class QuarterCircleStage extends CanvasStage {

    constructor() {
        super()
        this.qc = new QuarterLinkedCircle()
        this.animator = new QCAnimator()
    }

    render() {
        super.render()
        if (this.qc) {
            this.qc.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.qc.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.qc.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    init() {
        const stage = new QuarterCircleStage()
        stage.render()
        stage.handleTap()
    }
}

class QCState {

    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales += 0.1 * this.dir
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

class QCAnimator {

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

class QCNode {
    constructor(i) {
        this.state = new QCState()
        this.i = i
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < QC_NODES - 1) {
            this.next = new QCNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w , h) {
        const r = Math.min(w, h)/(2 * QC_NODES)
        context.save()
        context.translate(this.i * r, this.i * r)
        context.beginPath()
        const start = 90 * this.state.scales[1], end = 90 * this.state.scales[0]
        for(var i = start; i <= end; i++) {
            const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
            if (i == start) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
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
        if (this.dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class QuarterLinkedCircle {

    constructor() {
        this.curr = new QCNode()
        this.dir = 0
    }

    draw(context, w, h) {
        context.strokeStyle = '#2ecc71'
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        this.curr.draw(context, w, h)
        context.strokeStyle = '#212121'
    }

    startUpdaing(startcb) {
        this.state.startUpdating(startcb)
    }

    update(stopcb) {
        this.state.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }
}
