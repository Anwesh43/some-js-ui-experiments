const node_sentence = "Hello World! Good Morning Fellas"
const adjustFonts = (context, word, fontSize, gap) => {
    context.font = context.font.replace(/\d{2}/, fontSize)
    const tw = context.measureText(word).width
    if (tw < 0.9 * gap) {
        return adjustFonts(context, word, fontSize + 1, gap)
    }
    return fontSize

}
class LinkedSentenceStage extends CanvasStage {
    constructor() {
        super()
        this.lsl = new LinkedSentence()
        this.animator = new LSSAnimator()
    }

    render() {
        super.render()
        if (this.lsl) {
            this.lsl.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.lsl.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.lsl.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }

    static init() {
        const stage = new LinkedSentenceStage()
        if (stage.context) {
            console.log(stage.context.font)
            stage.context.font = '20px cursive'
        }
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
        this.state = new LSState()
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
            this.next = new LSSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context, w, h) {
        const n = node_sentence.split(" ").length
        const gap = w / n
        var fontSize = Math.min(w, h) / 20
        context.fillStyle = 'white'
        fontSize = adjustFonts(context, this.word, fontSize, gap)
        const tw = context.measureText(this.word).width
        context.save()
        context.translate(this.i * gap + gap/2, h/2)
        context.rotate(2 * Math.PI * this.state.scale)
        context.scale(this.state.scale, this.state.scale)
        context.fillText(this.word, -tw/2, fontSize / 2)
        context.restore()
        if (this.prev) {
            this.prev.draw(context, w, h)
        }
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

    draw(context, w , h) {
        this.curr.draw(context, w, h)
    }
}
