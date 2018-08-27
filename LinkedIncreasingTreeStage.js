const TINC_NODES = 5
class LinkedIncreasingTreeStage extends CanvasStage {
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
		const stage = new LinkedIncreasingTreeStage()
		stage.render()
		stage.handleTap()
	}
}
