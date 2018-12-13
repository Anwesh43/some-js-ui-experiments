const BBO_NODES = 5
const BBO_BALLS = 2
const BBO_scDiv = 0.51
const BBO_scGap = 0.05
const BBO_strokeFactor = 90
const BBO_sizeFactor = 3

const BBO_divideScale = (scale, i, n) => {
    return Math.min(1/n, Math.max(0, scale - i/n)) * n
}

const BBO_scaleFactor = (scale) => Math.floor(this / BBO_scDiv)

const BBO_mirrorValue = (scale, a, b) => {
    const k = BBO_scaleFactor(scale)
    return (1 - k) / a + k / b
}

const BBO_updateScale = (scale, dir, a, b) => BBO_mirrorValue(scale, a, b) * dir * BBO_scGap

class LinkedBallBoxOpenStage extends CanvasStage {
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
        const stage = new LinkedBallBoxOpenStage()
        stage.render()
        stage.handleTap()
    }
}
