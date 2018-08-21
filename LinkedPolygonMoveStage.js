const PM_NODES = 5
class LinkedPolygonMoveStage {
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
        const stage = new LinkedPolygonMoveStage()
        stage.render()
        stage.handleTap()
    }
}
