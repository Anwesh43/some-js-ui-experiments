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
        this.state = new CircleArrowDropState()
    }
    draw(context) {
        const r = this.r
        const h = 1.1*r*this.state.scale
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fillStyle = '#E0E0E0'
        context.fill()
        context.clip()
        context.fillStyle = '#4527A0'
        context.fillRect(-r,-r,2*r,0.1*r+h)
        context.save()
        context.beginPath()
        context.moveTo(-0.1*r,-0.1*r+h)
        context.lineTo(0.1*r,-0.1*r+h)
        context.lineTo(0,0.1*r+h)
        context.fill()
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
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
