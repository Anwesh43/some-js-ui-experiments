const LUM_NODES = 5
class LinkedLineUpMoverStage extends CanvasStage {
	constructor() {
		super()
		this.llum = new LinkedLineUpMover()
		this.animator = new LUMAnimator()
	}

	render() {
		super.render()
		if (this.llum) {
			this.llum.draw(this.context, this.size.w, this.size.h)
		}
	}

	handleTap() {
		this.canvas.onmousedown = () => {
			this.llum.startUpdating(() => {
				this.animator.start(() => {
					this.render()
					this.llum.update(() => {
						this.animator.stop()
					})
				})
			})
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
		this.state = new LUMState()
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
		if (this.state.scale < 1) {
			context.beginPath()
			context.moveTo(gap * this.state.scale, 0)
			context.lineTo(gap, 0)
			context.stroke()
		}
		context.save()
		context.translate(gap/2, -h/2 * sc)
		context.beginPath()
		context.moveTo(0, 0)
		context.lineTo(0, -gap/3)
		context.stroke()
		context.restore()
		context.restore()
		if (this.next) {
			this.next.draw(context, w, h)
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
		this.root.draw(context, w, h)
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