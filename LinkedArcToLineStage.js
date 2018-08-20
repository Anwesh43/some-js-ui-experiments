const ATL_NODES = 5
const drawArcToLineNode = (context, i, scale, w, h) => {
    const sc1 = Math.min(0.5, scale) * 2
    const sc2 = Math.min(0.5, Math.max(0.5, scale - 0.5)) * 2
    const gap = w / (ATL_NODES + 1)
    const r = gap / 4
    const a = r * (1 - sc1)
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / 60
    context.strokeStyle = '#4CAF50'
    context.save()
    context.translate(gap * i + gap / 2 + gap * sc2, h / 2)
    context.beginPath()
    for (var i = 90; i < = 270; i++) {
        const x = a + a * Math.cos(i * Math.PI/180)
        const y = r * Math.sin(i * Math.PI/180)
        if (i == 0) {
            context.moveTo(x, y)
        } else {
            context.lineTo(x, y)
        }
    }
    context.stroke()
    context.restore()
}

class LinkedArcToLineStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage = new LinkedArcToLineStage()
        stage.render()
        stage.handleTap()
    }
}

class ATLState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.05 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class ATLAnimator {
    constructor() {
        this.animated = false
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(50, cb)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class ATLNode {
    constructor(i) {
        this.i = i
        this.state = new ATLState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < ATL_NODES - 1) {
            this.next = new ATLNode(this.i + 1)
            this.next.prev = this
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    draw(context, w, h) {
        drawArcToLineNode(context, this.i, this.state.scale, w, h)
        if (this.next) {
            this.next.draw(context, w, h)
        }
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

class LinkedALT {
    constructor() {
        this.dir = 1
        this.curr = new ALTNode(0)
    }

    draw(context, w, h) {
        this.curr.draw(context, w, h)
    }

    update(cb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb) {
        this.curr.startUpdating(cb)
    }
}
