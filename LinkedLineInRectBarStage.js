const LIRB_NODES = 5
const LIRB_LINES = 4
const LIRB_scDiv = 0.51
const LIRB_scGap = 0.05
const LIRB_color = "#0D47A1"

const LIRB_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n
const LIRB_scaleFactor = (scale) => Math.floor(scale / LIRB_scDiv)
const LIRB_mirrorValue = (scale, a, b) => {
    const k = LIRB_scaleFactor(scale)
    return ((1 - k) / a) + (k / b)
}
const LIRB_updateScale = (scale, dir, a, b) => LIRB_scaleFactor(scale, a, b) * dir * LIRB_scGap

class LinkedLineInRectBarStage extends CanvasStage {
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
        const stage = new LinkedLineInRectBarStage()
        stage.render()
        stage.handleTap()
    }
}
