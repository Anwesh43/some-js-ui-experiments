class CircleArrowDropStage extends CanvasStage{
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class CircleArrowDrop {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
    }
    draw(context) {
        const r = this.r
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fillStyle = '#E0E0E0'
        context.fill()
        context.clip()
        context.fillStyle = '#4527A0'
        context.fillRect(-r,-r,2*r,0.4*r+1.6*r)
        const y = 1.6*r
        context.save()
        context.translate(0,y)
        context.beginPath()
        context.moveTo(-0.1*r,-0.1*r)
        context.lineTo(0.1*r,-0.1*r)
        context.lineTo(0,0.1*r)
        context.fill()
        context.restore()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
class CircleArrowDropState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    update(stopcb) {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg += 5*this.dir
        if(this.deg > 180) {
            this.deg = 0
            this.scale = 0
            this.dir = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
