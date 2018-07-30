const TF_NODES = 5, TF_SPEED = 0.025
class LinkedTriFillerStage extends CanvasStage {
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
        const stage = new LinkedTriFillerStage()
        stage.render()
        stage.handleTap()
    }
}
