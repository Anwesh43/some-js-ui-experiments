const LSJS_NODES = 5
const LSJS_LINES = 4

const LSJS_divideScale = (scale, n, i) => Math.min(1/n, Math.max(0, scale - 1/n * i)) * n

const LCJS_GAP = 0.05

const LSJS_scaleFactor = (scale) => Math.floor(scale / 0.5)

const LCJS_updateScale = (scale, dir) =>  {
    const k = LSJS_scaleFactor(scale)
    return LCJS_GAP * dir * (k + (1 - k) / LCJS_LINES)
}

class LineSquareJoinStepStage extends CanvasStage {
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
        const stage = new LineSquareJoinStepStage()
        stage.render()
        stage.handleTap()
    }
}

class LCJSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += LCJS_updateScale(this.scale, this.dir)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.prevScale = 1 - 2 * this.dir
            cb()
        }
    }
}
