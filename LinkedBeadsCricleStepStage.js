const BCS_NODES = 5
const BCS_beads = 6
const BCS_scDiv = 0.51
const BCS_scGap = 0.05
const BCS_color = "#1A237E"
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
