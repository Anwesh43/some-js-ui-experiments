const LES_NODES = 5
const LES_LINES = 2
const LES_LINE_WIDTH = 60
const LES_COLOR = "#0D47A1"
const LES_SIZE_FACTOR = 90
const LES_scGap = 0.05
const LES_scDiv = 0.51

const LES_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, i / n)) * n

const LES_scaleFactor = (scale) =>  Math.floor(scale / LES_scDiv)

const LES_mirrorValue = (scale, a, b) => {
    const k = LES_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const LES_updateScale = (scale, dir, a, b) => LES_mirrorValue(scale, a, b) * dir * LES_scGap

class LinkedLineExpandingStepStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {

    }
    handleTap() {

    }

    static init() {
        const stage = new LinkedLineExpandingStepStage()
        stage.render()
        stage.handleTap()
    }
}
