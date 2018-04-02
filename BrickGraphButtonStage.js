class BrickGraphButtonStage extends Stage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

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
        this.deg += Math.PI/20
        this.scale = Math.sin(this.deg * Math.PI/180)
        if (this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
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
    }
    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        context.fillStyle = '#3498db'
        context.globalAlpha = 1
        context.fillRect(0, 0, this.size, this.size)
        context.globalAlpha = 0.5
        context.fillStyle = '#bdc3c7'
        context.save()
        context.translate(this.size/2, this.size/2)
        context.scale(this.state.scale, this.state.scale)
        context.fillRect(-this.size/2, -this.size/2, this.size, this.size)
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    handleTap(x, y, startcb) {
        if (x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size) {
            this.state.startUpdating(startcb)
        }
    }
}
