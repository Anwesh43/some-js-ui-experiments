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

class LUMState {
	constructor() {
		this.scale = 0
		this.prevScale = 0
		this.dir = 0
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
			cb()
		}
	}
}

class LUMAnimator {
	constructor() {
		this.animated  = false
	}

	start(cb) {
		if (!this.animated) {
			this.animated = true 
			this.interval = setInterval(cb, 50)
		}
	}

	stop() {
		if (this.animated) {
			this.animated = false
			clearInterval(this.interval)
		}
	}
}
