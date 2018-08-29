const CONCCI_NODES = 5
class LinkedConcentricCircularMoverStage extends CanvasStage {
	constructor() {
		super()
		this.licci = new LinkedConcCi()
		this.animator = new ConcCiAnimator()
	}

	render() {
		super.render()
		if (this.licci) {
			this.licci.draw(this.context, this.size.w, this.size.h)
		}
	}

	handleTap() {
		this.canvas.onmousedown = () => {
			this.licci.startUpdating(() => {
				this.animator.start(() => {
					this.render()
					this.licci.update(() => {
						this.animator.stop()
					})
				})
			})
		}
	}

	static init() {
		const stage = new LinkedConcentricCircularMoverStage()
		stage.render()
		stage.handleTap()
	}
}

class ConcCiState {
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

//Creating animator
class ConcCiAnimator {
	constructor() {
		this.animated = false 
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
			clearInterval(this.interval, 50)
		}
	}
}

class ConcCiNode {
	constructor(i) {
		this.i = i 	
		this.state = new ConcCiState()
		this.addNeighbor()
		console.log(this.state)
	}

	addNeighbor() {
		if (this.i < CONCCI_NODES - 1) {
			this.next = new ConcCiNode(this.i + 1)
			this.next.prev = this 
		}
	}

	draw(context, w, h, drawNext, drawPrev) {
		context.lineWidth = Math.min(w, h) / 60
		context.lineCap = 'round'
		context.strokeStyle = 'white'
		const gap = h / (CONCCI_NODES+1)
		var r = (gap / (2 * CONCCI_NODES)) * (CONCCI_NODES - this.i) 
		console.log(`${gap} ${r} ${this.state.scale}`)
		const y = (gap * this.i) + gap 
		context.save()
		context.translate(0, gap * this.state.scale)
		context.beginPath()
		context.arc(w/2, y, r, 0, 2 * Math.PI)
		context.stroke()
		if (this.prev && drawPrev) {
			context.save()
			context.translate(0, 0)
			this.prev.draw(context, w, h, false, true)
			context.restore()	
		}
		context.restore()

		if (this.next && drawNext) {
			this.next.draw(context, w, h, true, false)
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

class LinkedConcCi {
	constructor() {
		this.curr = new ConcCiNode(0)
		this.dir = 1
	}

	draw(context, w, h) {
		this.curr.draw(context, w, h, true, true)
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