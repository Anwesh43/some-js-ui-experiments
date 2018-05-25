
class Error404Stage extends CanvasStage {

    constructor() {
        super()
        this.animator = new E404Animator()
        this.e404 = new E404()
    }

    render() {
        super.render()
        if (this.e404) {
            this.e404.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.e404.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.e404.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class E404State {

    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
        stopcb()
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class E404Animator {

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

class E404AnimationNode {
    constructor(cbs) {
        this.state = new State()
        this.cb = cb[0]
        cbs.splice(0,1)
        this.addNeighbor(cbs)
    }

    addNeighbor(cbs) {
        if (cbs.length > 0) {
            this.next = new E404AnimationNode(cbs)
            this.next.prev = this
        }
    }

    update(stopcb) {
        this.cb(this.state.scale)
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
        if (!curr) {
            cb()
            curr = this
        }
        return curr
    }
}

class E404 {
    constructor(w, h) {
        this.gap = 0
        this.y_0 = 0
        this.h_screen = 0
        this.dir = 1
    }

    draw(context,w, h) {
        if (!this.curr) {
            this.y_0 = h/2
            const cbs = []
            cbs.push((scale) => {
                this.gap = Math.min(w, h)/18 * scale
            })
            cbs.push((scale) => {
                this.y_0 = (h / 2) * (1 - scale)
            })
            cbs.push((scale) => {
                this.h_screen = h * scale
            })
            this.curr = new E404AnimationNode(cbs)
        }
        context.fillStyle = '#FFEE58'
        context.fillRect(0, 0, w, this.h_screen)
        context.font = context.font.replace(/\d{2}/, `${h/20}`)
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.fillStyle = 'white'
            context.fillText('4', this.gap * (1 - 2 * i), 0)
            context.restore()
        }
        context.fillText('0', 0, this.y_0)
        context.restore()
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
        })
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}
