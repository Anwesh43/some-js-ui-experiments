const LUM_NODES = 5
class LinkedLineUpMoverStage extends CanvasStage {
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
		const stage = new LinkedLineUpMoverStage()
		stage.render()
		stage.handleTap()
	}
}