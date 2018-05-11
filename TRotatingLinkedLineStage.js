const TRLL_NODES = 5
class TRotatingLinkedLineStage extends CanvasStage {

    constructor() {
        super()
        this.trll = new TRotatingLinkedLine()
        this.animator = new TRLLAnimator()
    }

    render() {
        super.render()
        if (this.trll) {
            this.trll.draw(this.context)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.trll.startUpdating(() => {
                this.animator.start(() => {
                    this.trll.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class TRLLState {

    constructor() {
        this.scales = [0, 0, 0, 0]
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

class TRLLAnimator {
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

class TRLLNode {

    constructor(i) {
        this.i = i
        if (i) {
            this.i = i
        }
        this.addNeighbor()
        this.state = new TRLLState()
    }

    addNeighbor() {
        if (this.i < TRLL_NODES - 1) {
            const next = new TRLLNode(this.i + 1)
            next.prev = this
            this.next = next

        }
    }

    draw(context, w, h) {
        context.strokeStyle = '#00838F'
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const gap = w / (2 * TRLL_NODES)
        const startX = -gap + gap * state.scales[3], endX = -gap + gap * state.scales[0]
        context.save()
        context.translate(this.i * gap + gap, h / 2)
        context.rotate(Math.PI/2 * (this.state.scales[1] + this.state.scales[2]))
        context.beginPath()
        context.moveTo(startX, 0)
        context.lineTo(endX, 0)
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

class TRotatingLinkedLine {

    constructor() {
        this.curr = new TRLLNode()
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(()=> {
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
