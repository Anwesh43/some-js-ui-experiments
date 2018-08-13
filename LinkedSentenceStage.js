const node_sentence = "Hello World! Good Morning Fellas"
class LinkedSentenceStage extends CanvasStage {
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
        const stage = new LinkedSentenceStage()
        stage.render()
        stage.handleTap()
    }
}

class LSState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.05 * this.dir
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

class LSSAnimator {
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
            clearInterval(this.interval)
        }
    }
}

class LSSNode {
    constructor(i) {
        this.i = i
        this.state = new LSSState()
        this.addNeighbor()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    addNeighbor() {
        const words = node_sentence.split(" ")
        if (this.i < words.length) {
            this.word = words[this.i]
        }
        if (this.i < words.length - 1) {
            this.next = new LLSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const n = node_sentence.split(" ").length
        const gap = w / n
        context.font = context.font.replace(/\d{2}/, Math.min(w, h) / 20)
        context.fillStyle = 'white'
        const tw = context.measureText(this.word).width
        context.save()
        context.translate(this.i * gap + gap/2, h/2)
        context.rotate(2 * Math.PI * this.state.scale)
        context.scale(this.state.scale, this.state.scale)
        context.fillText(this.word, -tw/2, Math.min(w, h) / 40)
        context.restore()
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

class LinkedSentence {
    constructor() {
        this.curr = new LSSNode(0)
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
}
