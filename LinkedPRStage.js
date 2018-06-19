const LPR_NODES = 5

class LinkedPRStage extends CanvasStage {
    constructor() {
        super()
        this.linkedPR = new LinkedPR()
        this.animator = new LPRAnimator()
    }

    render() {
        super.render()
        if (this.linkedPR) {
            this.linkedPR.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.linkedPR.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.linkedPR.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class LPRState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb(this.prevScale)
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

class LPRAnimator {
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

class LPRNode {

    constructor(i) {
        this.i = i
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LPR_NODES - 1) {
            this.next = new LPRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        context.fillStyle = 'white'
        const gap = w / LPR_NODES
        context.save()
        context.translate(this.i * gap - gap/6, h/2 - gap/6)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, gap/3)
        context.stroke()
        context.beginPath()
        for(var i = -90 ; i <= 90; i++) {
            const x = (gap / 6) * Math.cos(i * Math.PI/180), y = (gap/6) * Math.sin(i * Math.PI/180)
            if (i == -90) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.moveTo(0, gap/6)
        context.lineTo(gap/6, gap/6)
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

class LinkedPR {
    constructor() {
        this.curr = new LPRNode(0)
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
