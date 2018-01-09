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
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
          if(this.dir == 0) {
              this.dir = 1-2*this.scale
              startcb() 
          }
    }
}
const initTouchRotatorStage = () => {
    const stage = new TouchRotatorLineStage()
    stage.render()
}
