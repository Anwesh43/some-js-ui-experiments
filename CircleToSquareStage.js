class CircleToSquareStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class CircleToSquare {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
    }
    draw(context) {
        context.strokeStyle = '#2980b9'
        context.strokeWidth = this.size/20
        const r = this.size/2, ax = r/Math.sqrt(2), by = r - r/Math.sqrt(2)
        for(var i=0;i<4;i++) {
            context.save()
            context.translate(this.x,this.y)
            context.rotate(i*Math.PI/2)
            context.beginPath()
            for(var j=0;j<=180;j++) {
                const x = ax*Math.cos(j*Math.PI/180), y = by*Math.sin(j*Math.PI/180)
                if(j == 0) {
                    context.moveTo(x,y)
                } else {
                    context.lineTo(x,y)
                }
            }
            context.stroke()
            context.restore()
        }
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
