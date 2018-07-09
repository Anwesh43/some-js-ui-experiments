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
                        tis.animator.stop()
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

    start() {
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

class DLCNode {
    constructor(i) {
        this.i = i
        this.state = new DLCState()
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
        if (curr) {
            return curr
        }
        cb()
        return this
    }

    draw(context, w, h) {
        const gap = w / DLC_NODES
        const r = gap /4
        const sc1 = Math.min(0.5, this.state.scale), sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0))
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = 'teal'
        context.save()
        context.translate(i * gap, h/2)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(gap * 0.5 * sc1, 0)
        context.stroke()
        var k = 0
        context.beginPath()
        for (var i = 180 + 180 * sc2; i <=  + ; i++) {
            const x = gap/2 +  r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
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

    udpate(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.update(() => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
