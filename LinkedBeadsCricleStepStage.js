const BCS_NODES = 5
const BCS_beads = 6
const BCS_scDiv = 0.51
const BCS_scGap = 0.05
const BCS_color = "#1A237E"

const BCS_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const BCS_scaleFactor = (scale) => Math.floor(scale / BCS_scDiv)

const BCS_mirrorValue = (scale, a, b) => {
    const k = BCS_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const BCS_updateScale = (scale, dir, a, b) => dir * BCS_scGap * BCS_mirrorValue(scale, a, b)

class LinkedBeadsCircleStepStage extends CanvasStage {
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
        const stage = new LinkedBeadsCircleStepStage()
        stage.render()
        stage.handleTap()
    }
}
