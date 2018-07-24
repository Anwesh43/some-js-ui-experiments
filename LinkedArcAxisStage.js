const AANODES = 5
class LinkedArcAxisStage extends CanvasStage {
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
        const stage = new LinkedArcAxisStage()
        stage.render()
        stage.handleTap()
    }
}
