class CirclePacStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class CirclePacState {
    constructor(n) {
        this.j = 0
        this.n = 0
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    update(stopcb) {
        this.deg += this.dir * Math.PI/15
        this.scale = Math.sin(this.deg * Math.PI/180)
        if(this.deg > Math.PI) {
            this.deg = 0
            this.j ++
            if(this.j == this.n) {
                this.dir = 0
                this.deg = 0
                this.scale = 0
                stopcb()
            }
        }
    }
    startUpdating() {
        if(this.dir == 0) {
            this.dir = 1
            this.j = 0
        }
    }
}
class CirclePacAnimator {
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
class CirclePac {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.state = new CirclePacStage()
    }
    startUpdating(startcb) {
        this.circle.startUpdating(startcb)
    }
    update(stopcb) {
        this.circlePacStage.update(stopcb)
    }
    draw(context) {
        const scale = this.state.scale
        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        context.moveTo(0, 0)
        for(var i = 30 * scale; i <= 360 - 30*scale; i++) {
            const x = this.r * Math.cos(i*Math.PI/180), y = this.r * Math.sin(i * Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
    }
}
