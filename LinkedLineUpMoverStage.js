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

class LUMNode {
	constructor(i) {
		this.i = i
		this.addNeighbor()
	}

	addNeighbor() {
		if (this.i < LUM_NODES - 1) {
			this.next = new LUMNode(this.i + 1)
			this.next.prev = this	
		}
	}

	draw(context, w, h) {
		const gap = w / LUM_NODES 
		const sc = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2
		context.lineWidth = Math.min(w, h) / 60
		context.lineCap = 'round'
		context.strokeStyle = '#303F9F'
		context.save()
		context.translate(gap * this.i, h/2)
		context.beginPath()
		context.moveTo(0, 0)
		context.lineTo(gap * this.i, 0)
		context.stroke()
		context.beginPath()
		context.moveTo(gap / 2, 0)
		context.lineTo(gap / 2, -gap * sc)
		context.restore()
		if (this.next) {
			this.next.draw(context, w, )
		}
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

class LinkedLineUpMover {
	constructor() {
		this.root = new LUMNode(0)
		this.curr = this.root
		this.dir = 1
	}

	draw(context, w, h) {
		this.curr.draw(context, w, h)
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
}