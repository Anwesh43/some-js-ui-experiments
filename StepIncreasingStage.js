class StepIncreasingStage extends CanvasStage {
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
        const stage = new StepIncreasingStage()
        stage.render()
        stage.handleTap()
    }
}
