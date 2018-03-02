class RectTextBarStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class RectTextBarState {
    constructor(n) {
        this.scales = []
        this.prevScale = 0
        this.j = 0
        this.init(n)
    }
    init(n) {
        for(var i = 0; i < n; i++) {
            this.scales.push(0)
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
class RectTextBarAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class RectTextBar {
    constructor(i, text) {
        this.i = i
        this.text = text
    }
    draw(context, scale, size) {
        const x = this.i * this.size
        context.save()
        context.translate(x - size + size * scale, size/10)
        context.fillStyle = 'teal'
        context.fillRect(0, 0, size, size)
        context.font = context.font.replace(/\d{2}/,size/15)
        const tw = context.measureText(this.text).width
        context.fillText(text, size/2 - tw/2, size/2)
        context.restore()
    }
}
