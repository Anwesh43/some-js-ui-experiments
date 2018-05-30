const LSW_NODES = 5
class LinkedSineWaveStage extends CanvasStage {

    constructor() {
        super()
        this.lsw = new LinkedSineWave()
        this.animator = new LSWAnimator()
    }

    render() {
        super.render()
        if (this.lsw) {
            this.lsw.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.lsw.startUpdating(() => {
                this.animator.start(() => {
                    this.lsw.update(() => {
                        this.render()
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class LSWState {

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

class LSWAnimator {
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

class LSWNode {
    constructor(i) {
        this.i = i
        this.addNeighbor()
        this.state = new LSWState()
    }

    addNeighbor() {
        if (this.i < LSW_NODES) {
            this.next = new LSWNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / LSW_NODES
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        context.save()
        context.translate(gap * this.i, h/2)
        context.beginPath()
        context.moveTo(0, 0)
        for (var i = 0; i <= 360; i++) {
            context.lineTo(gap * (i / 360), gap * 0.5 * Math.sin(i * Math.PI/180))
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

class LinkedSineWave {

    constructor() {
        this.curr = new LSWNode()
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
        this.curr.starUpdating(startcb)
    }
}
