const MAX_SEQ_SQUARE = 5
class SquareSeqMoverStage extends CanvasStage {

    constructor() {
        super()
        this.mover = new SquareSeqMover()
        this.animator = new SSMAnimator()
    }

    render() {
        super.render()
        if (this.mover) {
            this.context.strokeStyle = '#27ae60'
            this.context.lineWidth = Math.min(this.size.w, this.size.h) / 60
            this.mover.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.mover.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.mover.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class SSMState {

    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
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

class SSMAnimator {

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

class SquareSeqNode {
    constructor(i) {
        this.state = new SSMState()
        if (!i) {
            this.i = 0
        }
        else {
            this.i = i
        }
    }

    addNeighbor() {
        if (this.i < MAX_SEQ_SQUARE - 1) {
            const NODE = new SquareSeqNode(this.i + 1)
            this.next = NODE
            NODE.prev = this
            NODE.addNeighbor()
        }
    }

    draw(context, w, h) {
        const size = w/(MAX_SEQ_SQUARE)
        const x1 = this.i * size + size * this.state.scales[1], x2 = this.i * size + size * this.state.scales[0], y1 = h/2 - size/2, y2 = h/2 + size/2
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y1)
        context.lineTo(x2, y2)
        context.lineTo(x1, y2)
        context.lineTo(x1, y1)
        context.stroke()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    move(dir, cb)  {
        if (dir == 1) {
            if (this.next) {
                return this.next
            }
            else {
                cb()
                return this.prev
            }
        }
        else {
            if (this.prev) {
                return this.prev
            }
            else {
                cb()
                return this.next
            }
        }
    }
}

class SquareSeqMover {
    constructor() {
        this.root = new SquareSeqNode()
        this.dir = 1
        this.curr = this.root
        this.curr.addNeighbor()
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.move(this.dir, () => {
                this.dir *= -1
            })
            console.log(this.curr)
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}

const initSquareSeqMover = () => {
    const stage = new SquareSeqMoverStage()
    stage.render()
    stage.handleTap()
}
