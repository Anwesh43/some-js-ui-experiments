const DLC_NODES = 5
class LinkedDecLineCircStage extends CanvasStage {
    constructor() {
        super()
        this.ldc = new LinkedDecLineCirc()
        this.animator = new DLCAnimator()
    }

    render() {
        super.render()
        if (this.ldc) {
            this.ldc.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.ldc.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.ldc.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedDecLineCircStage()
        stage.render()
        stage.handleTap()
    }
}

class DLCState {
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

class DLCAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                cb()
            }, 70)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class DLCNode {
    constructor(i) {
        this.i = i
        this.state = new DLCState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < DLC_NODES - 1) {
            this.next = new DLCNode(this.i + 1)
            this.next.prev = this
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
        console.log(curr)
        if (curr) {
            return curr
        }
        cb()
        return this
    }

    draw(context, w, h) {
        const gap = w / DLC_NODES
        const r = gap /4
        const sc1 = Math.min(0.5, this.state.scale) * 2, sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#2E7D32'
        context.save()
        context.translate(this.i * gap, h/2)
        if (sc1 < 1) {
            context.beginPath()
            context.moveTo(gap * 0.5 * sc1, 0)
            context.lineTo(gap * 0.5, 0)
            context.stroke()
        }
        var k = 0
        context.beginPath()
        for (var i = 180 + 180 * sc2; i <=  360; i++) {
            const x = gap/2 + r +  r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
            if (k == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
            k++
        }
        context.stroke()
        context.restore()
        if (this.next) {
            this.next.draw(context, w, h)
        }
    }
}

class LinkedDecLineCirc {
    constructor() {
        this.curr = new DLCNode(0)
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
