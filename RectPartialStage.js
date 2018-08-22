class RectPartialStage extends CanvasStage {
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
        const stage = new RectPartialStage()
        stage.render()
        stage.handleTap()
    }
}
