class NToShapeStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {

    }
}
class NTSState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.scale
            startcb()
        }
    }
}
class NTSAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = false
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
class NToMShape {
    constructor(w,h) {
        this.w = w
        this.h = h
        this.size = 2*Math.min(w,h)/3
        this.state = new NTSState()
    }
    draw(context) {
        const size = this.size, x = this.x, y = this.y
        context.lineWidth = size/20
        context.strokeStyle = '#27ae60'
        context.lineCap = 'round'
        context.save()
        context.translate(x,y)
        const x_gap = (size/2) * Math.sin(Math.PI/6), y_gap = (size/2)*Math.cos(Math.PI/6)
        for(var i = 0;i< 2; i++) {
            const factor = (2*i-1)
            context.save()
            context.translate(x_gap*factor,0)
            context.beginPath()
            context.moveTo(0, -y_gap)
            context.lineTo(0, y_gap)
            context.stroke()
            context.save()
            context.rotate(Math.PI/3*-factor + (2*Math.PI/3)*i*this.state.scale)
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(size/2*factor,0)
            context.stroke()
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
