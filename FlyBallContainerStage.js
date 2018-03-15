class FlyBallContainerStage extends CanvasStage {
    constructor() {
        super()
        this.flyBallContainer = new FlyBallContainer()
        this.flyBallAnimator = new FlyBallAnimator()
    }
    render() {
        super.render()
        if (this.flyBallContainer) {
            this.flyBallContainer.draw(this.context, this.size.w, this.size.h)
        }
    }
    handleTap() {
        if (this.flyBallContainer) {
            this.flyBallContainer.startUpdating(() => {
                this.flyBallAnimator.start(() => {
                    this.render()
                    this.flyBallContainer.update(() => {
                        this.flyBallAnimator.stop()
                    })
                })
            })
        }
    }
}
class FlyBallState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    update(stopcb) {
        this.deg += Math.PI/20 * this.dir
        this.scale = Math.sin(this.deg)
        if (this.deg > 2 * Math.PI) {
            this.dir = 0
            this.scale = 0
            this.deg = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class FlyBallContainerState {
    constructor() {
        this.states = [new FlyBallState(), new FlyBallState()]
        this.j = 0
    }
    update(stopcb) {
        this.states[this.j].update(() => {
            this.j++
            if(this.j == this.states.length) {
                this.j = 0
                stopcb()
            }
        })
    }
    execute(cb, index) {
        if (index < this.j) {
            cb(index)
        }
    }
    startUpdating(startcb) {
        this.states[this.j].startUpdating(startcb)
    }
}
class FlyBallContainer {
    constructor() {
        this.state = new FlyBallContainerState()
    }
    draw(context, w, h) {
        const r = Math.min(w, h)/10
        context.save()
        context.translate(w/2, h/2)
        context.beginPath()
        context.arc(0, 0, r, 0,  2 * Math.PI)
        context.stroke()
        for(var i = 0; i < 2; i++) {
            context.save()
            context.rotate(Math.PI/4 * this.state.scales[i])
            context.beginPath()
            context.moveTo(r, 0)
            context.lineTo(r * 3, 0)
            context.stroke()
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
}
class FlyBallAnimator {
    constructor() {
        this.animated = false
    }
    start (updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
               updatecb()
            }, 50)
        }
    }
    stop () {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
const initFlyBallContainerStage = () => {
    const flyBallContainerStage = new FlyBallContainerStage()
    flyBallContainerStage.render()
    flyBallContainerStage.handleTap()
}
