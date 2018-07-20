const TAB_NODES = 5, TAB_COLOR = '#607D8B'
class BrowserTabStage extends CanvasStage {
    constructor() {
        super()
        this.container = new BrowserTabContainer()
        this.animator = new BTAnimator()
    }

    render() {
        super.render()
        if (this.container) {
            this.container.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.container.startUpdating(x, y, () => {
                this.animator.start(() => {
                    this.render()
                    this.container.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new BrowserTabStage()
        stage.render()
        stage.handleTap()
    }
}

class BTState {
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

class BTAnimator {
    constructor() {
        this.animated = false
    }

    start() {
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

class TabNode {
    constructor(i) {
        this.i = i
        this.state = new BTState
        this.addNeighbor()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h, cb) {
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
        const gap = w / TAB_NODES
        const hSize = 0.2 * gap
        context.fillStyle = TAB_COLOR
        context.save()
        context.translate((this.i - 1) * gap + gap * this.state.scale, 0)
        if (cb) {
            cb(context, this.i, gap, hSize)
        }
        context.beginPath()
        context.rect(0, 0, gap, hSize)
        context.clipPath()
        context.beginPath()
        context.moveTo(0, hSize)
        context.lineTo(gap/2, hSize - gap)
        context.lineTo(gap, hSize)
        context.lineTo(0, hSize)
        context.fill()
        context.restore()
    }

    addNeighbor() {
        if (this.i < TAB_NODES - 1) {
            this.next = new BTNode(this.i + 1)
            this.next.prev = this
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

class TabExpander {
    constructor() {
        this.x = 0
    }

    draw(context, i, gap, hSize) {
        if (!this.size) {
            this.size = hSize
        }
        context.fillStyle = TAB_COLOR
        this.x = i * gap + gap
        context.save()
        context.translate(this.x, 0)
        context.beginPath()
        context.moveTo(0.05 * gap, hSize)
        context.lineTo(0.05 * gap + hSize, hSize)
        context.lineTo(hSize, 0)
        context.lineTo(0, 0)
        context.lineTo(0.05 * gap, hSize)
        context.fill()
        context.restore()
    }

    handleTap(x, y, cb) {
        if (x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size) {
            cb()
        }
    }
}

class BrowserTabContainer {
    constructor() {
        this.curr = new TabNode(0)
        this.dir = 1
        this.expander = new TabExpander()
    }

    draw(context, w , h) {
        this.curr.draw(context, w, h, (c, i, gap, size) => {
            this.expander.draw(c, i, gap, size)
        })
    }

    update(stopcb) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            stopcb()
        })
    }

    startUpdating(x, y, startcb) {
        this.expander.handleTap(x, y, () => {
            this.curr.startUpdating(startcb)
        })
    }
}
