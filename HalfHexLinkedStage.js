const HHL_NODES = 5
class HalfHexLinkedStage extends CanvasStage {
    constructor() {
        super()
        this.line = new HalfHexLinkedLine()
        this.animator = new HHLAnimator()
    }

    render() {
        super.render()
        if (this.line) {
            this.line.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.line.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.line.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new HalfHexLinkedStage()
        stage.render()
        stage.handleTap()
    }
}

class HHLState {
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

class HHLAnimator {

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

class HHLNode {

    constructor(i) {
        this.state = new HHLState()
        this.i = 0
        if (i) {
            this.i = i
        }
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < HHL_NODES - 1) {
            this.next = new HHLNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = (w / HHL_NODES)
        context.strokeStyle = '#673AB7'
        context.lineCap = 'round'
        context.lineWidth = Math.min(w,h) / 60
        context.save()
        context.translate(this.i * gap, h/2)
        const xs = [], ys = []
        for (var i = 4; i <= 6; i++) {
            xs.push(gap/2 + (gap/2) * Math.cos(i * Math.PI/3))
            ys.push((gap/2) * Math.sin(i * Math.PI/3))
        }
        var sx = 0, sy = 0
        var mx = 0, my = 0
        if (this.state.j > 0) {
            mx = xs[this.state.j - 1]
            my = ys[this.state.j - 1]
        }
        if (this.state.j > 1) {
            sx = xs[this.state.j - 2]
            sy = ys[this.state.j - 2]
        }
        var dx = gap , dy = 0
        if (this.state.j  < xs.length) {
            dx = xs[this.state.j]
            dy = ys[this.state.j]
        }
        var scaleS = 0, scaleE = this.state.scales[this.state.j]
        if (this.state.j > 0) {
            scaleS = this.state.scales[this.state.j]
            console.log(scaleS)
        }
        if (this.state.j == xs.length) {
            scaleE = 0
        }
        console.log(`${scaleS}, ${scaleE}, ${this.state.j}`)
        context.beginPath()
        context.moveTo(sx + (mx - sx) * scaleS, sy + (my - sy) * scaleS)
        context.lineTo(mx, my)
        context.lineTo(mx + (dx - mx) * scaleE, my + (dy - my) * scaleE)
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

class HalfHexLinkedLine {

    constructor() {
        this.curr = new HHLNode()
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
