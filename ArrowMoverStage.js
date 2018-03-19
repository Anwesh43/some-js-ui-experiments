class ArrowMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class ArrowMoverState {
    constructor() {
        this.scales = [0,0,0,0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j]) > 1) {
            this.scales[this.j] = this.dir
            this.j++
            if (this.j == this.scales.length) {
                this.j = 0
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            this.j = 0
            startcb()
        }
    }
}
