class TranslateShifter extends CanvasStage {
    constructor() {
        super()
        this.animator = new TranslateShifterAnimator()
        this.shifter = new TranslateShifter()
        this.handler = new MouseHandler()
        this.initMouseHandler()
    }
    initMouseHandler() {
        this.handler.handleMouseEvents(()=>this.animator.shouldStart(),
        (x,y)=>{
            this.shifter.addPoint()
            this.render()
        },
        ()=>{
            this.animator.start(()=>{
                this.shifter.update(()=>{
                    this.animator.stop()
                })
            })
        })
    }
    render(){
       super.render()
       this.shifter.draw(this.context)
    }
}
class TranslateShifter {
    constructor() {
        this.orig_points = []
        this.curr_points = []
        this.j = 0
        this.mode = 1
    }
    update(stopcb) {
        if(this.mode == 0) {
            this.updatePoints()
        }
        else {
            this.removePoints(stopcb)
        }
    }
    setOrig(x,y) {
        this.x = x
        this.y = y
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        this.curr_points.forEach((point,index)=>{
            if(index == 0) {
                context.moveTo(point.x,point.y)
            }
            else {
                context.lineTo(point.x,point.y)
            }
        })
        context.stroke()
        context.restore()
    }
    addPoint(x,y) {
        const curr_x = (x - this.x), curr_y = y - this.y
        const point = TranslateShifter.createNewPoint(urr)
        this.orig_points.push(point)
        this.curr_points.push(point)
        this.j++
    }
    removePoints(stopcb) {
        if(this.curr_points.length > 0 && this.j > 0) {
            const prevPoints = this.curr_points.splice(0,1)
            this.j--
            if(this.j == 0 && prevPoints.length == 1) {
                this.x += prevPoints[0].x
                this.y += prevPoints[0].y
                if(this.x < 0 || this.y < 0 || this.x > window.innerWidth || this.y > window.innerHeight) {
                    stopcb()
                    this.mode = 0
                }
            }
        }
    }
    updatePoints() {
        if(this.curr_points.length < this.orig_points.length) {
            this.curr_points.push(this.orig_points[this.j])
            this.j++
            if(this.j == this.orig_points.length) {
                this.mode = 1
            }
        }
    }
}
class TranslateShifterPoint {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    static createNewPoint(x,y) {
        return new TranslateShifterPoint(x,y)
    }
}
class TranslateShifterAnimator {
    constructor() {
        this.animated = false
    }
    startUpdating(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    shouldStart() {
        return !this.animated
    }
    stop() {
        if(this.animated) {
            this.animated = true
            clearInterval(this.interval)
        }
    }
}
class MouseHandler {
    constructor(stage) {
        this.stage = stage
        this.down = false
    }
    handleMouseEvents(shouldHandle,handlePoint,start) {
        this.canvas.onmousedown = (event) => {
            if(!this.down && shouldHandle()) {
                this.down = true
            }
        }
        this.canvas.onmousemove = (event) => {
            if(this.down) {
                handlePoint(event.offsetX,event.offsetY)
            }
        }
        this.canvas.onmouseup = (event) => {
            if(this.down) {
                this.down = true
                start()
            }
        }
    }
}
