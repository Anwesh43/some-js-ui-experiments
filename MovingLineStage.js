 class MovingLineStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
 }
class MovingPoint {
    constructor(x,y,x1,y1) {
        this.x = x
        this.y = y
        this.ox = x
        this.oy = y
        this.destX = x1
        this.destY = y1
    }
    move(scale) {
        this.x = this.ox + (this.destX-this.ox)*scale
        this.y = this.oy + (this.destY-this.oy)*scale
    }
    createFromMe(x,y) {
        return new MovingPoint(this.x,this.y,x,y)
    }
    drawFromPivot(context) {
        context.lineWidth = 10
        context.beginPath()
        context.moveTo(this.ox,this.y)
        context.lineTo(this.x,this.y)
        context.stroke()
        context.beginPath()
        context.arc(this.ox,this.oy,20,0,2*Math.PI)
        context.fill()
    }
}
class MovingPointContainer {
    constructor(size) {
        this.points = []
        this.start = size
    }
    draw(context) {
        context.strokeStyle = 'yellowgreen'
        context.fillStyle = 'yellowgreen'
        this.points.forEach((point)=>{
            point.drawFromPivot(context)
        })
        if(this.points.length == 0) {
            context.beginPath()
            context.arc(20,this.start.y,20,0,2*Math.PI)
            context.fill()
        }
    }
    addPoint(x,y,startcb,resetcb) {
        if(this.points.length > 0) {
            const prevPoint = this.points[this.points.length-1]
            const newPoint = prevPoint.createFromMe(x,y)
            this.points.push(newPoint)
            resetcb()
        }
        else {
            const newPoint = new MovingPoint(20,this.start.y/2,x,y)
            this.points.push(newPoint)
            startcb()
        }
    }
}
class MovingLineAnimator {
    constructor() {
        this.animated = false
    }
    start(updatcb) {
        if(this.animated) {
            this.interval = setInterval(()=>{
                updatcb()
            },50)
        }
    }
    reset() {

    }
}
