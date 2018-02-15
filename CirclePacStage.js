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
