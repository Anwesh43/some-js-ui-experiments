const RLB_NODES = 5, RLB_COLOR = "#FF5722"
class LinkedRLBSate extends CanvasStage {
	constructor() {
		super()
		this.lrlb = new LinkedRLB()
		this.animator = new RLBAnimator()
		this.init = false
	}

	render() {
		super.render()
		this.initStyle()
		if (this.lrlb) {
			this.lrlb.draw(this.context, this.size.w, this.size.h)
		}
	}

	initStyle() {
		this.context.fillStyle = RLB_COLOR 
		this.context.strokeStyle = RLB_COLOR
	}

	handleTap() {
		this.canvas.onmousedown = (event) => {
			this.lrlb.startUpdating(() => {
				this.animator.start(() => {
					this.render()
					this.lrlb.update(() => {
						this.animator.stop()
					})
				})
			})
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

class RLBNode {
	constructor(i) {
		this.i = i 
		this.state = new RLBState()
	}

	addNeighbor() {
		if (this.i < RLB_NODES - 1) {
			this.next = new RLBNode(this.i + 1)
			this.next.prev = this 
		}
	}

	draw(context, currI, w, h) {
		if (this.next) {
			this.next.draw(context, currI, w, h)
		}
		const gap = w / nodes
		context.lineWidth = Math.min(w, h) / 60
		context.lineCap = 'round' 
		context.save()
		context.translate(gap * this.i + gap / 2, h / 2)
		for (var i = 0; i < 2 ; i++) {
			context.save()
			context.rotate(Math.PI * (i + (1 -i) * this.state.scale))
			context.beginPath()
			context.moveTo(0, 0)
			context.lineTo(-gap/2, 0)
			context.stroke()
			if (i == 0 && currI == this.i) {
				context.beginPath()
				context.arc(-gap / 2 + gap/10, 0, gap / 10, 0, 2 * Math.PI)
				context.fill()
			}
			context.restore()
		}
		context.restore()
	}

	startUpdating(cb) {
		this.state.startUdpating(cb)
	}

	update(cb) {
		this.state.update(cb)
	}

	getNeighbor(dir, cb) {
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

class LinkedRLB {
	constructor() {
		this.root = new RLBNode(0)
		this.curr = this.root
		this.dir = 1
	}

	draw(context, w, h) {
		this.root.draw(context, this.curr.i, w, h)
	}

	update(cb) {
		this.curr.update(() => {
			this.curr = this.curr.getNeighbor(this.dir, () => {
				this.dir *= -1
			})
			cb()
		})
	}

	startUpdating(cb) {
		this.curr.startUpdating(cb)
	}
}