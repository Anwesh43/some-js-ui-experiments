const CCM_NODES = 5
class LinkedConcentricCircularMoverStage extends CanvasStage {
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
		const stage = new LinkedConcentricCircularMoverStage()
		stage.render()
		stage.handleTap()
	}
}