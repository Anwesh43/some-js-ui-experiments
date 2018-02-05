class CircleToPolygonStage extends CanvasStage {
    constructor(n) {
        super()
    }
    render() {
        super.render()
    }
}
class CTPState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        this.dir = 1-2*this.scale
        startcb()
    }
}
