class LinkedLittleBarLineStage extends CanvasStage {
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
        const stage = new LinkedLittleBarLineStage()
        stage.render()
        stage.handleTap()
    }
}
