class CircleDownStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class CircleDown {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.state = new CircleDownState()
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
        for(var i=0;i<4;i++) {
            context.save()
            context.rotate(i*Math.PI/2)
            context.beginPath()
            for(var j=0;j<90;j++) {
                const x = r*Math.cos(i*Math.PI/180), y = r*Math.sin(i*Math.PI/180)
                if(i == 0) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
                context.stroke()
            }
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
        this.curr = new CircleDown(size,size)
    }
    draw(context) {
        this.curr.draw(context)
        this.circleDowns.forEach((circleDown)=>{
            circleDown.draw(context)
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
        const circleDown = new CircleDown(curr.x,curr.y)
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
