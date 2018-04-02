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
