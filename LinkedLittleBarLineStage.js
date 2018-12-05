const LLBL_NODES = 5
const LLBL_BARS = 4
const LLBL_scDiv = 0.51
const LLBL_scGap = 0.05

const LLBL_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i/n)) * n
const LLBL_scaleFactor = (scale) => Math.floor(scale / LLBL_scDiv)
const LLBL_mirrorValue = (scale, a, b) => {
    const k = LLBL_scaleFactor(scale)
    return (1 - k) / a + k / b
}
const LLBL_updateScale = (scale, dir, a, b) => dir * LLBL_scGap * LLBL_mirrorValue(scale, a, b)

class LinkedLittleBarLineStage extends CanvasStage {
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
        const stage = new LinkedLittleBarLineStage()
        stage.render()
        stage.handleTap()
    }
}
