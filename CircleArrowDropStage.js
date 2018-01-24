class CircleArrowDropStage extends CanvasStage{
    constructor() {
        super()
        this.animator = new CircleArrowDropAnimator()
        this.container = new CircleArrowDropContainer(this.size.w,this.size.h)
        this.creator = new CircleArrowDropCreator(this.container)
    }
    startCreating() {
        this.creator.start()
    }
    render() {
        super.render()
        this.container.draw(this.context)
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.container.startUpdating(x,y,() => {
                this.animator.start(()=>{
                    this.container.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class CircleArrowDrop {
    constructor(x,y,r,i) {
        this.x = x
        this.y = y
        this.r = r
        this.i = i
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
    handleTap(x,y) {
        return x >= this.x - this.r && x <= this.x + this.r && y>=this.y - this.r && y <= this.y + this.r
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
class CircleArrowDropContainer {
    constructor(w,h) {
        this.w = w
        this.h = h
        this.circles = []
        this.updatingCircles = []
        this.n = 0
    }
    draw(context) {
        this.circles.forEach((circle)=>{
            circle.draw(context)
        })
    }
    update(stopcb) {
        this.updatingCircles.forEach((circle,index) => {
            circle.update(()=>{
                this.updatingCircles.splice(index,1)
                this.circles = this.circles.filter((curr)=>curr.i != circle.i)
                stopcb()
            })
        })
    }
    startUpdating(x,y,startcb) {
        for(var i=0;i<this.circles.length;i++) {
            const circle = this.circles[i]
            if(circle.handleTap(x,y)) {
                this.updatingCircles.push(circle)
                circle.startUpdating(startcb)
            }
        }
    }
    createRandomCircle() {
        const x = Math.floor(Math.random()*w) , const y = Math.floor(Math.random()*h)
        var present = false
        for(var i=0;i<this.circles.length;i++) {
            const circle = this.circles[i]
            if(circle.x == x && circle.y == y) {
                present = true
                break
            }
        }
        if(present) {
            return createRandomCircle()
        }
        this.n++
        return new Circle(x,y,Math.min(this.w,this.h)/8,this.n)
    }
    createCircle() {
        const circle = this.createRandomCircle()
        this.circles.push(circle)
    }
}
class CircleArrowDropCreator {
    constructor(container) {
        this.container = container
        this.t = 0
    }
    start() {
        var worker = new Worker("IntervalWorker.js")
        worker.onmessage = (message) => {
            console.log(message)
            if(message.data == "create") {
                this.container.createRandomCircle()
            }
        }
    }
}
class CircleArrowDropAnimator {
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
