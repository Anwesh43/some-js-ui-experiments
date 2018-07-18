const BSM_NODES = 5
class BoxStepMoverStage extends CanvasStage {
    constructor() {
        super()
        this.linkedBSM = new LinkedBSM()
        this.animator = new BSMAnimator()
    }

    render() {
        super.render()
        if (this.linkedBSM) {
            this.linkedBSM.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedBSM.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedBSM.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new BoxStepMoverStage()
        stage.render()
        stage.handleTap()
    }
}

class BSMState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class BSMAnimator {
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

class BSMNode {
    constructor(i) {
        this.i = i
        this.state = new BSMState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < BSM_NODES - 1) {
            this.next = new BSMNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const color = '#2E7D32'
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        const size =(Math.min(w,h)/3)
        const gap = size / BSM_NODES
        const sc1 = Math.min(0.5, this.state.scale - 0.5) * 2
        const sc2 = Math.min(0.5, Math.max(0, this.state.scale - 0.5)) * 2
        context.save()
        context.translate(w/2 - (size/2), h/2 - (size/2) - gap * sc1)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(gap, 0)
        context.stroke()
        context.fillRect(-gap/20 + gap * sc2, -gap/10, gap/10, gap/10)
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

class LinkedBSM {
    constructor() {
        this.curr = new BSMNode(0)
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
