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
        context.strokeStyle = 'yellowgreen'
        context.lineWidth = 10
        context.beginPath()
        context.moveTo(this.ox,this.y)
        context.lineTo(this.x,this.y)
        context.stroke()
    }
}
