const CONCCI_NODES = 5
class LinkedConcentricCircularMoverStage extends CanvasStage {
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
		const stage = new LinkedConcentricCircularMoverStage()
		stage.render()
		stage.handleTap()
	}
}

class ConcCiState {
	constuctor() {
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

	start() {
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
		var r = (gap / (CONCCI_NODES)) * (CONCCI_NODES - this.i) 
		context.save()
		context.translate(w/2, (gap * this.i) + gap + gap * this.state.scale)
		context.beginPath()
		context.arc(0, 0, r, 0, 2 * Math.PI)
		context.stroke()
		if (this.prev && drawPrev) {
			context.save()
			context.translate(0, -gap)
			this.prev.draw(context, w, h, false, true)
			context.restore()	
		}
		if (this.next && drawNext) {
			this.next.draw(context, w, h, true, false)
		}
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

