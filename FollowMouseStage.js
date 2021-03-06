class FollowMouseStage extends CanvasStage {
    constructor() {
        super()
        this.followMouse = new FollowMouse(this.size.w/2, this.size.h/2)
        this.animator = new FollowMouseAnimator()
    }
    render() {
        super.render()
        if(this.followMouse) {
            this.followMouse.draw(this.context, Math.min(this.size.w, this.size.h)/20)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.followMouse.startUpdating(x, y, () => {
                this.animator.start(() => {
                    this.render()
                    this.followMouse.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class FollowMouseState {
    constructor() {
        this.scales = [0, 0, 0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                this.prevScale = this.scales[this.j]
                if(this.j == 0) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class FollowMouseAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class FollowMouse {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.prevX = x
        this.prevY = y
        this.destX = x
        this.destY = y
        this.state = new FollowMouseState()
    }
    draw(context,size) {
        const color = '#4CAF50'
        context.fillStyle = color
        context.strokeStyle = color
        context.lineCap = 'round'
        context.lineWidth = size/20
        const scales = this.state.scales
        this.x = this.prevX + (this.destX - this.prevX) * scales[1]
        this.y = this.prevY + (this.destY - this.prevY) * scales[0]
        const x = this.x
        const y = this.y
        const x1 = this.prevX + (this.destX - this.prevX) * scales[2]
        const y1 = this.prevY + (this.destY - this.prevY) * scales[1]
        context.save()
        context.beginPath()
        context.arc(x, y, size * (1 - scales[0] + scales[2]), 0, 2*Math.PI)
        context.fill()
        context.beginPath()
        context.moveTo(this.prevX, y1)
        context.lineTo(this.prevX, y)
        context.stroke()

        context.beginPath()
        context.moveTo(x1, this.destY)
        context.lineTo(x, this.destY)
        context.stroke()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(x,y, startcb) {
        this.state.startUpdating(() => {
          this.destX = x
          this.destY = y
          startcb()
        })
    }
}
const initFollowMouseStage = () =>  {
    const followMouseStage = new FollowMouseStage()
    followMouseStage.render()
    followMouseStage.handleTap()
}
