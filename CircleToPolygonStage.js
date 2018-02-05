class CircleToPolygonStage extends CanvasStage {
    constructor(n) {
        super()
        this.initCircleToPolygon(n)
    }
    initCircleToPolygon(n) {
        const w = this.size.w, h = this.size.h
        this.circleToPolygon = new CircleToPolygon(w/2,h/2,Math.min(w,h)/3,n)
        this.animator = new CTPAnimator()
    }
    render() {
        super.render()
        if(this.circleToPolygon) {
            this.circleToPolygon.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.circleToPolygon.startUpdating(()=>{
                this.animator.start(() => {
                    this.render()
                    this.circleToPolygon.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class CTPState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir*0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        this.dir = 1-2*this.scale
        startcb()
    }
}
class CTPAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
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
class CircleToPolygon {
    constructor(x,y,r,n) {
        this.x = x
        this.y = y
        this.r = r
        this.n = n
        this.state = new CTPState()
    }
    draw(context) {
        const n = this.n
        const scale = this.state.scale
        context.lineWidth = this.r/20
        context.lineCap = 'round'
        context.strokeStyle = '#5E35B1'
        if(n > 0) {
            const gap = (360/n), start = 90 - gap/2 , y_final = this.r*Math.sin(start*Math.PI/180)
            context.save()
            context.translate(this.x,this.y)
            for(var i = 0; i<n; i++) {
                context.save()
                context.rotate(i*gap*Math.PI/180)
                context.beginPath()
                for(var j=start;j<=start+gap;j++) {
                    const x = this.r*Math.cos(j*Math.PI/180), y = y_final*scale + this.r*(1-scale)*Math.sin(j*Math.PI/180)
                    if(j == start) {
                        context.moveTo(x,y)
                    }
                    else {
                        context.lineTo(x,y)
                    }
                }
                context.stroke()
                context.restore()
            }
            context.restore()
        }
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initCircleToPolygonStage = (n) => {
    const circleToPolygonStage = new CircleToPolygonStage(n)
    circleToPolygonStage.render()
    circleToPolygonStage.handleTap()
}
