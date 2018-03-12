class ColoredBeadsStage extends CanvasStage {
    constructor () {
        super()
        this.container = new ColoredBeadContainer(this.size.w, this.size.h)
        this.animator = new ColoredBeadAnimator()
    }
    render() {
        super.render()
        if (this.container) {
            this.container.draw(this.context)
        }
    }
    scroll() {
        window.scrollBy(0, this.canvas.offsetTop)
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.container.startUpdating(() => {
                this.animator.start(()=>{
                    this.render()
                    this.container.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class ColoredBeadState {
    constructor() {
        this.scales = [0, 0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.prevScale = this.scales[this.j]
                this.dir = 0
                stopcb()
            }
        }
    }
}
class ColoredBeadAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() =>  {
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
class ColoredBead {
    constructor(i) {
        this.r_val = Math.floor(255 * Math.random())
        this.g_val = Math.floor(255 * Math.random())
        this.b_val = Math.floor(255 * Math.random())
        this.i = i
    }
    draw(context, scales, size, deg) {
        const updateColorPart = (colorPart) => Math.floor(255 + (colorPart - 255) * scales[2])
        context.fillStyle = `rgb(${updateColorPart(this.r_val)},${updateColorPart(this.g_val)},${updateColorPart(this.b_val)})`
        context.save()
        context.rotate(this.i * deg * scales[1])
        context.beginPath()
        context.arc(size * scales[0], 0, size/12, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }
}
class ColoredBeadContainer {
    constructor (w,h) {
        this.w = w
        this.h = h
        this.state = new ColoredBeadState()
        this.initBeads()
    }
    initBeads () {
        const BEADS = 10;
        this.beads = []
        for(var i = 0; i < BEADS; i++) {
            this.beads.push(new ColoredBead(i))
        }
    }
    draw (context) {
        context.save()
        context.translate(this.w/2, this.h/2)
        this.beads.forEach((bead) =>{
            bead.draw(context, this.state.scales, Math.min(this.w, this.h)/3, (2 * Math.PI/(this.beads.length)))
        })
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initColoredBeadStage = () => {
    const coloredBeadStage = new ColoredBeadsStage()
    coloredBeadStage.render()
    coloredBeadStage.handleTap()
    coloredBeadStage.scroll()
}
