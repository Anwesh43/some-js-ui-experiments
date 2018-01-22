class CircleDownStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new CircleDownAnimator()
        this.container = new CircleDownContainer(Math.min(this.size.w,this.size.h)/6)
    }
    render() {
        super.render()
        if(this.container) {
            this.container.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousemove = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.render()
            this.container.move(x,y)
        }
        this.canvas.onmousedown = (event) => {
            this.container.startUpdating(()=>{
                this.animator.start(()=>{
                    this.render()
                    this.container.update(()=>{
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class CircleDown {
    constructor(x,y,movable) {
        this.x = x
        this.y = y
        this.movable = movable
        this.state = new CircleDownState()
        console.log()
    }
    move(x,y) {
        this.x = x
        this.y = y
    }
    draw(context,r) {
        context.save()
        context.translate(this.x,this.y)
        context.lineWidth = r/10
        context.lineCap = 'round'
        var scale = 1-this.state.scale
        if(this.movable) {
            scale = 1
        }
        for(var i=0;i<=4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.beginPath()
            for(var j=0;j<90*scale;j++) {
                const x = r*Math.cos(j*Math.PI/180), y = r*Math.sin(j*Math.PI/180)
                if(i == 0) {
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
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class CircleDownState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.dir = 0
            this.prevScale = 1
            this.scale = 1
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
class CircleDownAnimator {
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
class CircleDownContainer {
    constructor(size) {
        this.circleDowns = []
        this.curr = new CircleDown(size,size,true)
        this.size = size
    }
    draw(context) {
        context.strokeStyle = '#F7630C'
        this.curr.draw(context,this.size)
        this.circleDowns.forEach((circleDown)=>{
            circleDown.draw(context,this.size)
        })
    }
    update(stopcb) {
        this.circleDowns.forEach((circleDown)=>{
            circleDown.update(()=>{
                this.circleDowns.splice(0,1)
                if(this.circleDowns.length == 0) {
                    stopcb()
                }
            })
        })
    }
    startUpdating(start_callback) {
        const circleDown = new CircleDown(this.curr.x,this.curr.y)
        circleDown.startUpdating(()=>{
            if(this.circleDowns.length == 0) {
                start_callback()
            }
            this.circleDowns.push(circleDown)
        })
    }
    move(x,y) {
        this.curr.move(x,y)
    }
}
const initCircleDownStage = ()=> {
    const stage = new CircleDownStage()
    stage.render()
    stage.handleTap()
}
