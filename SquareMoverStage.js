class SquareMoverStage extends CanvasStage {
    constructor() {
        super()
        this.squareMover = new SquareMover(this.size.w, this.size.h)
        this.animator = new SquareMoverAnimator()
    }
    render() {
        super.render()
        if(this.squareMover) {
            this.squareMover.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX
            if(x != this.squareMover.x) {
                const diff = x - this.squareMover.x
                this.squareMover.startUpdating(diff/Math.abs(diff), () => {
                    this.animator.start(() => {
                        this.render()
                        this.squareMover.update(() => {
                            this.animator.stop()
                        })
                    })
                })
            }
        }
    }
}
class SquareMoverState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j]) > 1) {
            this.scales[this.j]  = 1
            this.j += this.dir
            if(this.j == this.scales.length) {
                this.dir = 0
                this.j = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.scales = [0, 0]
            startcb()
        }
    }
}
class SquareMoverAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class SquareMover {
    constructor(w, h) {
        this.dir = 0
        this.x = w/2
        this.y = h/2
        this.size = Math.min(w,h)/15
        this.state = new SquareMoverState()
    }
    draw(context) {
        context.fillStyle = 'teal'
        context.strokeStyle = 'teal'
        context.lineWidth = Math.min(w,h)/60
        context.lineCap = 'round'
        context.save()
        context.translate(this.x, this.y)
        const size_updated = this.size * (1 - this.state.scales[0])
        const square2_size = this.size * (this.state.scales[1])
        context.fillRect(-size_updated/2, -size_updated/2, size_updated, size_updated)
        const x1 = 4 * this.size * this.state.scales[0] * this.dir, x = 4 * this.size * this.state.scales[1] * this.dir
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x1, 0)
        context.stroke()
        console.log(`${x} ${x1}`)
        context.fillRect(4 * this.size * this.dir - square2_size/2, -square2_size/2, square2_size, square2_size)
        context.restore()
    }
    update(stopcb) {
        this.state.update(() => {
            this.x += 4*this.size * this.dir
            this.dir = 0
            stopcb()
        })
    }
    startUpdating(dir, startcb) {
        if(this.dir == 0) {
            this.dir = dir
            this.state.startUpdating(startcb)
        }
    }
}
const initSquareMoverStage = () => {
    const squareMoverStage = new SquareMoverStage()
    squareMoverStage.render()
    squareMoverStage.handleTap()
}
