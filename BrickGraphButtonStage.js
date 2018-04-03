class BrickGraphButtonStage extends CanvasStage {
    constructor() {
        super()
        this.brickButtonGraph = new BrickButtonGraph(this.size.h)
        this.animator = new BrickGraphAnimator()
    }
    render() {
        super.render()
        if (this.brickButtonGraph) {
            this.brickButtonGraph.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.brickButtonGraph.handleTap(x, y, () => {
                this.animator.start(() => {
                    this.render()
                    this.brickButtonGraph.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class BrickGraphState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
    update(stopcb) {
        this.deg += Math.PI/20 * this.dir
        this.scale = Math.sin(this.deg)
        if (this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            this.dir = 0
            stopcb()
        }
    }
}

class BrickGraphAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 100)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class BrickButton {
    constructor(i, size, n) {
        this.i = i
        this.x = (i%n) * size
        this.y = Math.floor(i/n) * size
        this.size = size
        this.state = new BrickGraphState()
        this.neighbors = []
        console.log(`${this.x},${this.y}, ${this.size},${i}`)
    }
    draw(context) {
        const rectSize = 2 * this.size/3
        const drawRect = () => {
            context.fillRect(-rectSize/2, -rectSize/2, rectSize, rectSize)
        }
        context.save()
        context.translate(this.x + this.size/2, this.y + this.size/2)
        context.fillStyle = '#3498db'
        context.globalAlpha = 1
        drawRect()
        context.fillStyle = '#bdc3c7'
        context.save()
        context.scale(this.state.scale, this.state.scale)
        drawRect()
        context.restore()
        context.restore()
    }
    addNeighbor(bb) {
        this.neighbors.push(bb);
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    handleTap(x, y, startcb) {
        if (x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size) {
            this.neighbors.forEach((n)=> {
                n.startUpdating(() => {
                    startcb(n, false)
                })
            })
            this.startUpdating(() => {
                startcb(this, true)
                console.log("tapped")
            })
            console.log("drawn")
        }
    }
}

class BrickButtonGraph {
    constructor(w) {
        this.init(w)
        this.updating = []
    }
    init(w) {
        this.buttons = []
        const n = 4
        for (var i=0; i< n * n; i++) {
            this.buttons.push(new BrickButton(i,(w/n),n))
        }
        for (var i = 0; i < n * n; i++) {
            const button = this.buttons[i]
            const ri = i % n, rj = Math.floor(i / n)
            for (var e = ri - 1; e <= ri+ 1; e++) {
                for (var f =rj-1; f <= rj + 1; f++) {
                    if (ri == e && rj == f) {
                        continue
                    }
                    if (e >=0 && e < n && f>=0 && f < n) {
                        const index = f * n + e
                        button.addNeighbor(this.buttons[index])
                    }
                }
            }
            console.log(button.neighbors)
        }
    }
    draw(context) {
        this.buttons.forEach((button) => {
            button.draw(context)
        })
    }
    update(stopcb) {
        this.updating.forEach((button,index) => {
            button.update(() => {
                if (index == this.updating.length - 1) {
                    this.updating = []
                    stopcb()
                }
            })
        })
    }
    handleTap(x, y, startcb) {
        this.buttons.forEach((button) => {
            button.handleTap(x, y, (n, condition) => {
                this.updating.push(n)
                if (condition) {
                    startcb()
                    console.log("started")
                }
            })
        })
    }
}

const initBrickGraphButtonStage = () => {
    const stage = new BrickGraphButtonStage()
    window.scrollTo(0, stage.canvas.offsetTop)
    stage.render()
    stage.handleTap()
}
