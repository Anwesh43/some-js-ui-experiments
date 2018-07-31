const SFS_SPEED = 0.05, SFS_NODE = 3
class LinkedSquareFillStepStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {

    }

    static init() {

    }
}

class SFSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += SFS_SPEED * this.dir
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

class SFSAnimator {
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

class SFSNode {

    constructor(i) {
        this.i = i
        this.state = new SFSState()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < SFS_NODE - 1) {
            this.next = new SFSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const sc1 = Math.min(this.state.scale, 0.5) * 2
        const sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2
        const gap = (0.8 * w) / SFS_NODE
        const size = gap / 2
        context.save()
        context.translate(gap * sc2)
        context.save()
        context.translate(0.1 * w + this.i * gap + gap / 2, h / 2)
        context.rotate(i * Math.PI/2)
        context.scale(sc1, sc1)
        context.fillStyle = 'white'
        context.fillRect(0, 0, size/2, size/2)
        context.restore()
        context.restore()
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
