const RLB_NODES = 5
class LinkedRLBSate extends CanvasStage {
	constructor() {
		super()
	}

	render() {
		super.render()
	}

	handleTap() {
		this.canvas.onmousedown = (event) => {

		}
	}

	static init() {
		const stage = new LinkedRLBStage()
		stage.render()
		stage.handleTap()
	}
}