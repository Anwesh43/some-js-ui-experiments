const NUM_TRI_WAVES = 10
class TriWaveStepStage extends HTMLElement {

    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {

        }
    }
}

class TWSState {

    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == 0) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
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

class TWSAnimator {

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

class TWSNode {

    constructor(i) {
        this.state = new TWSState()
        this.i = 0
        if (i) {
            this.i = i
        }
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }

    draw(context, w, h) {
        const gap = w / NUM_TRI_WAVES
        const gap1 = (gap/2) * this.state.scales[0], gap2 = (gap/2) * this.state.scales[1], gap3 = (gap/2) * this.state.scales[2]
        context.save()
        context.translate(i * gap , h/2)
        context.beginPath()
        context.moveTo(gap2, -gap2)
        context.lineTo(gap1 + gap3, -gap1 + gap3)
        context.lineTo(gap1 + gap2, -gap1 + gap2)
        context.stroke()
        context.restore()
    }

    addNeighbor() {
        if (this.i < NUM_TRI_WAVES -1) {
            const NODE = new TWSNode(this.i+1)
            NODE.prev = this
            this.next = NODE
            NODE.addNeighbor()
        }
    }
}
