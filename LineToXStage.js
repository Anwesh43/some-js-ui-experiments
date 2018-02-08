class LineToXStage extends CanvasStage {
    constructor() {
        super()
        this.ltx = new LTX(this.size.w/2,this.size.h/2,2*Math.min(this.size.w,this.size.h)/3)
        this.animator = new LTXAnimator()
    }
    render() {
        super.render()
        if(this.ltx) {
            this.ltx.draw(this.context)
        }
    }
    onResize(w,h) {
        super.onResize(w,h)
        this.ltx = new LTX(this.size.w/2,this.size.h/2,2*Math.min(this.size.w,this.size.h)/3)
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.ltx.startUpdating(() => {
                this.animator.start(() => {
                  this.render()
                  this.ltx.update(() => {
                      this.animator.stop()
                  })
                })
            })
        }
    }
}
class LTXAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class LTXState {
    constructor() {
        this.scales = [0,0,0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.prevScale = this.scales[this.j]
                this.dir = 0
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.prevScale
            startcb()
        }
    }
}
class LTX {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = new LTXState()
        console.log(size)
    }
    draw(context) {
        const color = '#2ecc71'
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = this.size/30
        context.lineCap = 'round'
        const scales = this.state.scales
        const size = this.size
        context.save()
        context.translate(this.x,this.y)
        for(var i = 0;i<4;i++) {
            const x_scale = 1 - 2*(i%2), y_scale = 1 - 2*Math.floor(i/2)
            context.save()
            context.scale(x_scale,y_scale)
            context.save()
            context.translate(-size/2,-size/2)
            context.beginPath()
            context.arc(0,0,(size/8) * scales[0],0,2*Math.PI)
            context.fill()
            context.save()
            context.rotate((Math.PI/4)*scales[2])
            context.beginPath()
            context.moveTo(0,0)
            const x_diff = (size/Math.sqrt(2)) - size/2
            context.lineTo(size/2*scales[1]+x_diff*scales[2],0)
            context.stroke()
            context.restore()
            context.restore()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initLTXStage = () => {
    const ltxStage = new LineToXStage()
    ltxStage.render()
    ltxStage.handleTap()
}
