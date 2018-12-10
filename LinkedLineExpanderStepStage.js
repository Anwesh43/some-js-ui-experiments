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

const drawLESNode = (context, i, scale, w, h) => {
    const gap = w / (LES_NODES + 1)
    const sc1 = LES_divideScale(scale, 0, 2)
    const sc2 = LES_divideScale(scale, 1, 2)
    const size = gap / LES_SIZE_FACTOR
    context.save()
    context.translate(i * (gap + 1), h/2)
    for (var j = 0; j < LES_LINES; j++) {
        const sf = 1 - 2 * (j%2)
        context.save()
        context.translate(0, size * Math.floor(j/2))
        context.moveTo(0, 0)
        context.lineTo(0, size/2 * sf)
        context.stroke()
        context.restore()
    }
    for (var j = 0; j < LES_LINES; j++) {
        const sf = 1 - 2 * j
        const sc = LES_divideScale(sc1, j, LES_LINES)
        context.save()
        context.translate(0, size * Math.floor(j/2))
        context.rotate(Math.PI/2 * sc)
        context.moveTo(0, 0)
        context.lineTo(0, size * sf)
        context.stroke()
        context.restore()
    }
    context.restore()
}
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
