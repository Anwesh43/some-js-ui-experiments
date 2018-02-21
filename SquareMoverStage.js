class SquareMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

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
            this.scales[this.j]  = this.prevScale + this.dir
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
        }
    }
}
