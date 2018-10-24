const RS_NODES = 5
const RS_STEPS = 3
class LinkiedRectShifterStage extends CanvasStage {
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
        const stage = new LinkiedRectShifterStage()
        stage.render()
        stage.handleTap()
    }
}
