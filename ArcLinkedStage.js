const ALNODES = 5

class ArcLinkedStage extends CanvasStage {

    constructor() {
        super()
        this.arcLinked = new ArcLinked()
        this.animator = new ALAnimator()
    }

    render() {
        super.render()
        if (this.arcLinked) {
            this.arcLinked.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.arcLinked.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.arcLinked.update(() => {
                        this.render()
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class ALState {

    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        console.log(this.scales)
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

class ALAnimator {

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

class ALNode {
    constructor(i) {
        this.state = new ALState()
        this.i = 0
        if (i) {
            this.i = i
        }
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < ALNODES - 1) {
            const NODE = new ALNode(this.i + 1)
            this.next = NODE
            NODE.prev = this
        }
    }

    draw(context, w, h) {
        var start = 180 + Math.floor(180 * this.state.scales[1]), end = 180 + Math.floor(180 * this.state.scales[0])
        const size = (0.9 * w) / ALNODES, r = size/2
        console.log(size)
        context.strokeStyle = '#16a085'
        context.lineWidth = Math.min(w, h)/50
        context.lineCap = 'round'
        context.save()
        context.translate(0.1 * size + this.i * size + r, h/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.scale(1, 1 - 2 * i)
            context.beginPath()
            for (var j = start; j <= end; j++) {
                const x = r * Math.cos(j * Math.PI/180), y = r * Math.sin(j * Math.PI/180)
                if (j == start) {
                    context.moveTo(x, y)
                }
                else {
                    context.lineTo(x, y)
                }
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

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

class ArcLinked {
    constructor() {
        this.curr = new ALNode()
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

const initArcLinkedStage = () => {
    const arcLinkedStage = new ArcLinkedStage()
    arcLinkedStage.render()
    arcLinkedStage.handleTap()
}
