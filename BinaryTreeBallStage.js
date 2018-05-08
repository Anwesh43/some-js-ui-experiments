const LEVELS = 5
class BinaryTreeBallStage extends CanvasStage {

    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
}

class BTBState {

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

class BTBAnimator {

    constructor() {
        this.animated = false
    }

    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
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

class BTBNode {

    constructor(i, x, y, gap) {
        this.x = x
        this.y = y
        this.i = i
        this.addChildren(gap)
    }
    addParent(parent) {
        this.parent = parent
        this.state = new BTBState()
    }
    addChildren(gap) {
        if (this.i < LEVELS -1) {
            const left = new BTBNode(this.i+1, this.x - gap, y + gap, gap)
            const right = new BTBNode(this.i+1, this.x - gap, y + gap, gap)
            left.addParent(parent)
            right.addParent(parent)
            this.left = left
            this.right = right
        }
    }

    draw(context, w , h) {
        var x = this.x, y = this.y, r = Math.min(w,h) / (LEVELS * 3)
        if (this.parent) {
            x = this.parent.x + (this.x - this.parent.x) * this.state.scale
            y = this.parent.y + (this.y - this.parent.y) * this.state.scale
        }
        context.fillStyle = '#e67e22'
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
