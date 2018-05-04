const RL_NODES = 5
class RotatingLinkedLineStage extends CanvasStage {

    constructor() {
        super()
        this.animator = new RLLAnimator()
        this.rotatingLinkedLine = new RotatingLinkedLine()
    }

    render() {
        super.render()
        if (this.rotatingLinkedLine) {
            this.rotatingLinkedLine.draw(this.context)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.rotatingLinkedLine.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.rotatingLinkedLine.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class RLLState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1
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

class RLLAnimator {
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

class RLLNode {

    constructor(i) {
        this.state = new RLLState()
        this.i = 0
        if (i) {
            this.i = i
        }
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < RL_NODES - 1) {
            const NODE = new RLLNode(this.i+1)
            this.next = NODE
            NODE.prev = this
        }
    }

    draw(context, w, h) {
        const size = (0.9 * w) / (RL_NODES)
        context.save()
        context.translate(this.i * size, h/2)
        context.rotate(Math.PI/2 * this.state.scales[1])
        context.beginPath()
        context.moveTo(0, -size * this.state.scales[2])
        context.lineTo(0, -size * this.state.scales[0])
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

class RotatingLinkedLine {

    constructor() {
        this.curr = new RLLNode(0)
        this.dir = 1
    }

    draw(context) {
        this.curr.draw(context)
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
        this.state.startUpdating(startcb)
    }
}

const initRotatingLinkedLine = () => {
    const stage = new RotatingLinkedLineStage()
    stage.render()
    stage.handleTap()
}
