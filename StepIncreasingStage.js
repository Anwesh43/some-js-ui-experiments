const SIS_NODES = 5
class StepIncreasingStage extends CanvasStage {
    constructor() {
        super()
        this.linkedSIS = new LinkedSIS()
        this.animator = new SISAnimator()
    }

    render() {
        super.render()
        if (this.linkedSIS) {
            this.linkedSIS.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedSIS.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedSIS.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new StepIncreasingStage()
        stage.render()
        stage.handleTap()
    }
}

class SISState {
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

class SISAnimator {
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

class SISNode {
    constructor(i) {
        this.i = i
        this.state = new SISState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < SIS_NODES - 1) {
            this.next = new SISNode()
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / SIS_NODES
        const hGap = h / SIS_NODES
        context.fillStyle = 'white'
        context.save()
        context.translate(this.i * gap + gap * this.state.scale,  h - hGap * this.i - hGap - hGap * this.state.scale)
        context.fillRect(0, 0, gap, hGap * this.i + hGap + hGap * this.state.scale)
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
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

class LinkedSIS {

    constructor() {
        this.curr = new SISNode(0)
        this.dir = 1
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

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }
}
