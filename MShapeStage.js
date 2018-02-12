class MShapeStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class MShapeState {
    constructor() {
        this.scales = [0,0]
        this.dir = 0
        this.j = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                if(this.j == 0) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class MShapeAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            })
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class MShape {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = new MShapeState()
    }
    draw(context) {
        context.lineWidth = this.size/25
        context.strokeStyle = '#2ecc71'
        context.lineCap = 'round'
        const scales = this.state.scales
        const gap = this.size/(3*Math.sqrt(2))
        context.save()
        context.translate(this.x,this.y)
        for(var i=0;i<2;i++) {
            const factor = i*2-1
            context.save()
            context.translate(gap*factor,0)
            context.beginPath()
            context.moveTo(0,(-size/2)*scales[0])
            context.lineTo(0,(size/2)*scales[0])
            context.stroke()
            context.save()
            context.translate(0,-size/2)
            context.rotate((Math.PI/4)*factor*scales[1])
            context.beginPath()
            context.moveTo(0,0)
            context.lineTo(0,(size/3)*scales[0])
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
