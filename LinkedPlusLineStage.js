const LPL_NODES = 5
class LinkedPlusLineStage extends CanvasStage {
    constructor() {
        super()
        this.lpl = new LinkedPlusLine()
        this.animator = new LPLAnimator()
    }

    render() {
        super.render()
        if (this.lpl) {
            this.lpl.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lpl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lpl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedPlusLineStage()
        stage.render()
        stage.handleTap()
    }
}

class LPLState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        console.log(this.scale)
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
            console.log(this.dir)
            startcb()
        }
    }
}

class LPLAnimator {
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

class LPLNode {
    constructor(i) {
        this.i = i
        this.state = new LPLState()
        this.addNeighbor()
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

    addNeighbor() {
        if (this.i < LPL_NODES - 1) {
            this.next = new LPLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#00BCD4'
        const gap = (Math.min(w, h) * 0.4) / LPL_NODES
        context.save()
        context.translate(this.i * gap, 0)
        context.beginPath()
        context.moveTo(gap * this.state.scale, 0)
        context.lineTo(gap, 0)
        context.stroke()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
    }
}

class LinkedPlusLine {
    constructor() {
        this.curr = new LPLNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < 4; i++) {
            context.save()
            context.rotate(Math.PI/2 * i)
            this.curr.draw(context, w, h)
            context.restore()
        }
        context.restore()
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
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
