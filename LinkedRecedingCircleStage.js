const RCL_NODES = 5
class LinkedRecedingCircleStage extends CanvasStage {

    constructor() {
        super()
        this.lrc = new LinkedRecedingCircle()
        this.animator = new RCLAnimator()
    }

    render() {
        super.render()
        if (this.lrc) {
            this.lrc.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lrc.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lrc.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class RCLState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir;
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

class RCLAnimator {
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

class RCLNode {
    constructor(i) {
        this.i = i
        this.state = new RCLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < NODES - 1) {
            this.next = new RCLNode(this.i + 1)
            this.next.prev = this
        }
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        const gap = w / RCL_NODES
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = 'teal'
        const r = gap / 2
        context.save()
        context.translate(this.i * gap + r, h/2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.scale(1, 1 - 2 * i)
            context.beginPath()
            var k = 0
            for (var j = 180 + 180 * this.state.scale; j <= 360; j++) {
                const x = r * Math.cos(j * Math.PI/180), y = r * Math.sin(j * Math.PI/180)
                if (k == 0) {
                    context.moveTo(x, y)
                } else {
                    context.lineTo(x, y)
                }
                k++
            }
            context.stroke()
            context.restore()
        }
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
}

class LinkedRecedingCircle {
    constructor() {
        this.curr = new RCLNode(0)
        this.dir = 1
    }

    update(stopcb) {
        this.state.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }
}
