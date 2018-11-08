const LSJS_NODES = 5
const LSJS_LINES = 4

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
