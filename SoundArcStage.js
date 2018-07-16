const SA_NODES = 5

const drawArc = (context, r, startDeg, endDeg) => {
    context.beginPath()
    for (var i = startDeg; i <= endDeg; i++) {
        const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
        if (i == startDeg) {
            context.moveTo(x, y)
        } else {
            context.lineTo(x, y)
        }
    }
    context.stroke()
}

class SoundArcStage extends CanvasStage {
    constructor() {
        super()
        this.lsa = new LinkedSA()
        this.animator = new SAAnimator()
    }

    render() {
        super.render()
        if (this.lsa) {
            this.lsa.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lsa.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lsa.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new SoundArcStage()
        stage.render()
        stage.handleTap()
    }
}

class SAState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.1 * this.dir
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

class SAAnimator {
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

class SANode {
    constructor(i) {
        this.i = i
        this.state = new SAState()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    draw(context, w, h) {
        const r = (Math.min(w, h) / 3) / SA_NODES
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#9E9E9E'
        const deg = 30 * this.state.scale
        drawArc(context, r * (this.i + 1), -30, 30)
        context.strokeStyle = '#FAFAFA'
        drawArc(context, r * (this.i + 1), -deg, deg)
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

class LinkedSA {
    constructor() {
        this.curr = new SANode(0)
        this.dir = 1
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

    draw(context, w, h) {
        context.save()
        context.translate(w/2, h/2)
        this.curr.draw(context, w, h)
        context.restore()
    }
}
