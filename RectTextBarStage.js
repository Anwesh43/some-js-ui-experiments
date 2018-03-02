const rectTextBarColors = ["#1abc9c", "#9b59b6", "#e74c3c", "#16a085"]
class RectTextBarStage extends CanvasStage {
    constructor(text) {
        super()
        this.container = new RectTextBarContainer(text, this.size.w/2)
        this.animator = new RectTextBarAnimator()
    }
    render() {
        super.render()
        if(this.container) {
            this.container.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.container.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.container.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }
}
class RectTextBarState {
    constructor(n) {
        this.scales = []
        this.prevScale = 0
        this.j = 0
        this.dir = 0
        this.init(n)
    }
    init(n) {
        for(var i = 0; i < n; i++) {
            this.scales.push(0)
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.05 * this.dir
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
    draw(context, scales, size) {
        const scale = scales[this.i]
        const x = this.i * size
        context.globalAlpha = 0.7
        context.save()
        context.translate(x - size + size * scale, size/10)
        context.fillStyle = rectTextBarColors[this.i%rectTextBarColors.length]
        context.fillRect(0, 0, size, size)
        context.font = context.font.replace(/\d{2}/,size/5)
        const tw = context.measureText(this.text).width
        context.fillStyle = 'white'
        context.globalAlpha = 1
        context.fillText(this.text, size/2 - tw/2, size/2 + size/20)
        context.restore()
        console.log(x)
    }
}
class RectTextBarContainer {
    constructor(text, w) {
        this.w = w
        this.rectTextBars = []
        this.init(text)
    }
    init(text) {
        var textArray = text.split(" ")
        for(var i = 0; i < textArray.length; i++) {
            var t = textArray[i]
            this.rectTextBars.push(new RectTextBar(i, t))
        }
        this.state = new RectTextBarState(textArray.length)
    }
    draw(context) {
        for(var i = this.state.j; i >=0 ; i--) {
            this.rectTextBars[i].draw(context, this.state.scales, this.w/this.rectTextBars.length)
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initRectTextBarStage = (text) => {
    const stage = new RectTextBarStage(text)
    stage.render()
    stage.handleTap()
}
