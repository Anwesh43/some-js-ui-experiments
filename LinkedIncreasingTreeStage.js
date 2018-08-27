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

class TIState {
	constructor() {
		this.scale = 0
		this.dir = 0
		this.prevScale = 0
	}

	update(cb) {
		this.scale += this.dir * 0.1 
		if (Math.abs(this.scale - this.prevScale) > 1) {
			this.scale = this.prevScale + this.dir 
			this.dir = 0
			this.prevScale = this.scale 
			cb()
		}
	}

	startUpdating(cb) {
		if (this.dir == 0) {
			this.dir = 1 - 2 * this.prevScale 
		}
	}
}

