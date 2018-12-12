class BoxUpMoverStage extends CanvasStage {
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
        const stage = new BoxUpMoverStage()
        stage.render()
        stage.handleTap()
    }
}
