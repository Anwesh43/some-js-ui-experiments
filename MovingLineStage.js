 class MovingLineStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new Animator()
        this.container = new MovingPointContainer(this.size)
    }
    render() {
        super.render()
    }
    renderLine(scale) {
        this.render()
        this.container.draw(this.context,scale)
    }
    handleTap() {
        this.canvas.onclick = (event) => {
            this.animator.start((scale) => {
                this.renderLine(scale)
            })
        }
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
        this.state = new MovingLineState()
    }
    start(updatcb) {
        if(!this.animated) {
            this.state.startUpdating()
            this.animated = true
            this.interval = setInterval(()=>{
                this.state.update()
                updatcb(this.state.scale)
            },50)
        }
    }
    reset() {
        this.state.reset()
    }
}
class MovingLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
    }
    startUpdating() {
        this.dir = 1
    }
    update() {
        this.scale += this.dir*0.1
    }
    reset() {
        this.scale = 0
    }
}
const initMovingLineStage = () => {
    const stage = new MovingLineStage()
    stage.renderLine(0)
    stage.handleTap()
}
