const XCS_NODE = 5, XCS_STEP  = 2
class LinkedXCreateStepStage extends CanvasStage {
    constructor() {
        super()
    }

    render() {
        super.render()
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage = new LinkedXCreateStepStage()
        stage.render()
        stage.handleTap()
    }
}


class XCSState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }

    update(cb) {
        this.scale += (0.1 / XCS_STEP) * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
