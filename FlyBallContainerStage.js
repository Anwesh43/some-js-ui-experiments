class FlyBallContainerStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

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
