class TouchRotatorLine {
    constructor(x,y,w) {
        this.x = x
        this.y = y
        this.w = w
        this.deg = 0
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        contexr.rotate(this.deg*Math.PI/180)
        context.strokeStyle = 'yellowgreen'
        context.lineWidth = this.w/30
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(this.w,0)
        context.stroke()
        context.restore()
    }
    startUpdating(deg,startcb) {

    }
    update(stopcb) {

    }
}
class TouchRotatorLineStage extends CanvasStage{
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
const initTouchRotatorStage = () => {
    const stage = new TouchRotatorLineStage()
    stage.render()
}
