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
		this.scale += this.dir * 0.05
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

class TIAnimator {

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

class TINode {
	constructor(i) {
		this.i = i
		this.state = new TIState()
		this.addNeighbor()
	}

	addNeighbor() {
		if (this.i < TINC_NODES - 1) {
			this.next = new TINode(this.i + 1)
			this.next.prev = this
		}
	}

	draw(context, w, h) {
		context.lineWidth = Math.min(w, h) / 60
		context.lineCap = 'round'
		context.strokeStyle = ''
		const gap = h / (TINC_NODES + 1)
		const y = h - (gap * this.i + gap/2 + gap/10)
		const sc2 = Math.min(0.5, Math.max(0, this.state.scale - 0.5)) * 2
		context.save()
		context.translate(w/2, y)
		context.beginPath()
		context.moveTo(0, gap)
		context.lineTo(0, gap * (1 - this.state.scale))
		context.stroke()
		context.restore()
	}

	update(cb) {
		this.state.update(cb)
	}

	startUpdating(cb) {
		this.state.startUpdating(cb)
	}

	getNext(dir, cb) {
		var curr = this.prev 
		if (dir == 1) {
			curr = this.next 
		}
		if (curr) {
			return curr
		}
		cb()
		return this
	}
} 

class IncreasingTree {
	constructor() {
		this.curr = new TINode(0)
		this.dir = 1
	}

	update(cb) {
		this.curr.update(() => {
			this.curr = this.curr.getNext(this.dir, () => {
				this.dir *= -1
			})
			cb()
		})
	}

	startUpdating(cb) {
		this.curr.startUpdating(cb)
	}

	draw(context, w, h) {
		this.curr.draw(context, w, h)
	}
}