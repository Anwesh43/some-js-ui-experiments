const PM_NODES = 5
const drawPMNode = (context, i, scale, w, h, cb, useI) => {
    const gap = Math.min(w, h) / (PM_NODES + 1)
    const deg = (2 * Math.PI) / PM_NODES
    const size = gap / 2
    const a = (size / 2) / Math.tan(deg / 2)
    var location = gap * i + gap / 2 + gap * scale
    if (!useI) {
        location = 0
    }
    context.lineWidth = Math.min(w, h) / 60
    context.lineCap = 'round'
    context.strokeStyle = '#388E3C'
    context.save()
    context.translate(location, location)
    if (cb) {
        cb()
    }
    context.save()
    context.rotate(deg * i)
    context.beginPath()
    context.moveTo(-size / 2, a)
    context.lineTo(size / 2, a)
    context.stroke()
    context.restore()
    context.restore()
}
class LinkedPolygonMoveStage extends CanvasStage {
    constructor() {
        super()
        this.linkedPM = new LinkedPM()
        this.animator = new PMAnimator()
    }
    render() {
        super.render()
        if (this.linkedPM) {
            this.linkedPM.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.linkedPM.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedPM.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
    static init() {
        const stage = new LinkedPolygonMoveStage()
        stage.render()
        stage.handleTap()
    }
}

class PMState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += this.dir * 0.1
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

class PMAnimator {
    constructor() {
        this.animated = false
    }

    start(cb){
       if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
       }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class PMNode {
    constructor(i) {
        this.i = i
        this.state = new PMState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < PM_NODES - 1) {
            this.next = new PMNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, useI, nextDraw, prevDraw, w, h) {
        drawPMNode(context, this.i, this.state.scale, w, h, () => {
            if (prevDraw && this.prev) {
                this.prev.draw(context, false, false, true, w, h)
            }
        }, useI)
        if (this.next && nextDraw) {
            this.next.draw(context, true, true, false, w, h)
        }
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
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

class LinkedPM {
    constructor() {
        this.curr = new PMNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.curr.draw(context, true, true, true, w, h)
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
