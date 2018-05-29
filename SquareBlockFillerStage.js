class SquareBlockFillerStage extends CanvasStage {

    constructor() {
        super()
        this.squareBlockFiller = new SquareBlockFiller()
        this.animator = new SBFAnimator()
    }

    render() {
        super.render()
        if (this.squareBlockFiller) {
            this.squareBlockFiller.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.squareBlockFiller.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.squareBlockFiller.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class SBFState {

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

class SBFAnimator {

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
            this.animated = true
            clearInterval(this.interval)
        }
    }
}

class SBFNode {

    constructor(cbs) {
        this.cb = this.cbs[0]
        cbs.splice(0, 1)
        this.state = new SBFState()
        this.addNeighbor(cbs)
    }

    addNeighbor(cbs) {
        if (cbs.length > 0) {
            this.next = new SBFNode(cbs)
            this.next.prev = this
        }
    }

    draw(context, size) {
        this.cb(context, size, this.state.scale)
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

class SquareBlockFiller {
    constructor() {

    }

    initNodes() {
        const cbs = []
        const addLine = (i) => {
            cbs.push((context, size, scale) => {
                context.strokeStyle = '#4CAF50'
                context.lineWidth = 6
                context.lineCap = 'round'
                context.save()
                context.rotate(i * Math.PI/2)
                context.beginPath()
                context.moveTo(-size/2, -size/2)
                context.lineTo(-size/2, size/2)
                context.stroke()
                context.restore()
            })
        }

        const addSquare = (i) => {
            cbs.push((context, size, scale) => {
                const position = size * 0.45 - 0.05 * size * scale
                const dimension = 0.1 * size * scale
                context.save()
                context.rotate(Math.PI/2 * i)
                context.fillStyle = '#f44336'
                context.fillRect(position, position, dimension, dimension)
                context.restore()
            })
        }

        const addFilledSquare = (i) => {
            cbs.push((context, size, scale) => {
                const position = 0.4 * size * (1 - scale)
                const dimension = size * 0.1 * (1 + 4 * scale)
                context.save()
                context.rotate(Math.PI/2 * i)
                context.fillStyle = '#f44336'
                context.fillRect(position, position, dimension, dimension)
                context.restore()
            })
        }

        for (var i = 0; i < 4; i++) {
            addLine(i)
        }

        for (var i = 0; i < 4; i++) {
            addSquare(i)
        }

        for (var i = 0; i < 4; i++) {
            addFilledSquare(i)
        }
        this.curr = new SBFNode(cbs)
    }

    draw(context, w, h) {
        this.curr.draw(context, Math.min(w, h)/3)
    }

    update(stopcb) {
        this.state.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUdpating(startcb) {
        this.state.startUpdating(startcb)
    }
}
