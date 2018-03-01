class TapCircleMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class TCMState {
    constructor() {
        this.scales = [0, 0]
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(this.scales[this.j] > 1) {
            this.scales[this.j] = 1
            this.j++
            if(this.j == this.scales.length) {
                this.j = 0
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            this.scales = [0,0]
            startcb()
        }
    }
}
