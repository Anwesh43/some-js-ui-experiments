class LinkedBouncingBallStage extends CanvasStage {
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
        const stage = new LinkedBouncingBallStage()
        stage.render()
        stage.handleTap()
    }
}
