const LDR_NODES = 5

class LinkedDotRectExpanderStage extends CanvasStage {

    constructor() {
        super()
        this.ldr = new LinkedDotRect()
        this.animator = new LDRAnimator()
    }

    render() {
        super.render()
        if (this.ldr) {
            this.ldr.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.ldr.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.ldr.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedDotRectExpanderStage()
        stage.render()
        stage.handleTap()
    }
}

class LDRState {
    constructor() {
        this.deg = 0
        this.dir = 0
        this.prevDeg = 0
        this.scale = 0
    }

    update(stopcb) {
        this.deg += Math.PI/10
        this.scale = Math.sin(this.deg)
        if (Math.abs(this.deg - this.prevDeg) > Math.PI/2) {
            this.deg = this.prevDeg + this.dir * Math.PI/2
            this.scale = Math.sin(this.deg)
            this.dir = 0
            this.prevDeg = this.deg
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * Math.floor(this.prevDeg / (Math.PI/2))
            startcb()
        }
    }
}

class LDRStateContainer {
    constructor() {
        this.states = [new LDRState(), new LDRState()]
        this.j = 0
        this.dir = 0
        this.kDir = 1
    }

    update(stopcb) {
        if (this.j < this.states.length && this.j >= 0) {
            this.states[this.j].update(() => {
                this.j += this.dir
                if (this.j == this.states.length || this.j == -1) {
                    this.kDir *= -1
                    this.j += this.kDir
                    this.dir = 0
                    this.dir = 0
                    stopcb()
                } else {
                    this.states[this.j].startUpdating(() => {

                    })
                }
            })
        }
    }
    get(index) {
        return this.states[index]
    }
    startUpdating(startcb) {
        if ((this.j == 0 || this.j == this.states.length-1) && this.dir == 0) {
            this.dir = this.kDir
            this.states[this.j].startUpdating(startcb)
        }
    }

}

class LDRAnimator {
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

class LDRNode {
    constructor(i) {
        this.i = i
        this.state = new LDRStateContainer()
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < LDR_NODES - 1) {
            this.next = new LDRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const gap = w / LDR_NODES
        const index = this.i % 2
        const scale = index + (1 - 2 * index) * this.state.get(1).scale
        context.fillStyle = 'white'
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        context.save()
        context.translate(this.i * gap  - gap/2 + (gap) * this.state.get(0).scale, h/2)
        for (var i = 0; i < 9; i++) {
            const x = -gap/2 + (i%3 * (gap/2) + gap/10), y = -(gap/2) + (Math.floor(i/3)) * gap/2 + gap/10
            context.save()
            context.translate(x * scale, y * scale)
            context.fillRect(-gap/10, -gap/10, gap/5, gap/5)
            context.restore()
        }
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

class LinkedDotRect {
    constructor() {
        this.ldrNode = new LDRNode(0)
        this.dir = 1
    }

    draw(context, w, h) {
        this.ldrNode.draw(context, w, h)
    }

    update(stopcb) {
        this.ldrNode.update(() => {
            this.ldrNode = this.ldrNode.getNext(this.dir, () => {
                this.dir*=-1
            })
            console.log(this.ldrNode)
            stopcb()
        })
    }

    startUpdating(startcb) {
        this.ldrNode.startUpdating(startcb)
    }
}
