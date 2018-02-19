class LineBallStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class LineBallState {
    constructor() {
        this.scales = [0,0,0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.size || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                if(this.dir == -1) {
                    this.j += this.dir
                }
                else {
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
