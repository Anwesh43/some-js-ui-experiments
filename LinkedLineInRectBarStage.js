const LIRB_NODES = 5
const LIRB_LINES = 4
const LIRB_scDiv = 0.51
const LIRB_scGap = 0.05
const LIRB_color = "#0D47A1"

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
