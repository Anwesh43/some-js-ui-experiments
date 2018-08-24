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

class RLBState {
	constructor() {
		this.scale = 0
		this.dir = 0
		this.prevScale = 0
	}

	update(cb) {
		this.scale += 0.1 * this.dir 
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
			cb()
		}
	}
}

class RLBAnimator {
	constructor() {
		this.animated = false
	}

	start(cb) {
		if (!this.animated) {
			this.animated = true 
			window.setInterval(cb, 50)
		}
	}

	stop() {
		if (this.animated) {
			this.animated = true 
			window.clearInterval(this.interval)
		}
	}
}

