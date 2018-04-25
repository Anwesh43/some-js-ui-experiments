const CL_NODES = 10;
class CircleLinkedStepStage extends CanvasStage {

    constructor() {
        super()
        this.animator = new CLSAnimator()
        this.circleLinkedStep = new CircleLinkedStep()
    }

    render() {
        super.render()
        if (this.circleLinkedStep) {
            this.circleLinkedStep.draw(this.context)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.circleLinkedStep.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.circleLinkedStep.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class CLSState {
    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
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

class CLSAnimator {

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

class CLSNode {

    constructor(i) {
        this.state = new CLSState()
        this.i = 0
        if (i) {
            this.i = i
        }
    }

    addNeighbor() {
        if (this.i < CL_NODES - 1) {
            const NODE = new CLSNode(this.i + 1)
            this.next = NODE
            NODE.prev = this
            NODE.addNeighbor()
        }
    }

    draw(context, w, h) {
        const GAP = w / CL_NODES
        context.strokeStyle = '#2ecc71'
        context.lineWidth = Math.min(w, h) / 50
        context.lineCap = 'round'
        const getAngles = (i) => 180 + Math.floor(180 * this.state.scales[i])
        const start = getAngles(1), end = getAngles(0)
        context.save()
        context.translate(this.i * gap, h/2)
        for (var i = start; i <= end; i++) {
            const x = (gap/2) * Math.cos(i * Math.PI/180), y = (gap/2) * Math.sin(i * Math.PI/180)
            if (i == start) {
                context.beginPath()
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
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

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

class CircleLinkedStep {

    constructor() {
        this.curr = new CLSNode()
        this.curr.addNeighbor()
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(this.context)
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.getNext(() => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}

const initCircleLinkedStepStage = () => {
    const circleLinkedStepStage = new CircleLinkedStepStage()
    circleLinkedStepStage.render()
    circleLinkedStepStage.handleTap()
}
