class CircleToSquareStage extends CanvasStage {
    constructor() {
        super()
        this.circleToSquare = new CircleToSquare(this.size.w/2,this.size.h/2,Math.min(this.size.w,this.size.h)/2)
        this.animator = new CircleToSquareAnimator()
    }
    render() {
        super.render()
        if(this.circleToSquare) {
            this.circleToSquare.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.circleToSquare.startUpdating(() => {
                console.log("start")
                this.animator.start(() => {
                    console.log("updating")
                    this.render()
                    this.circleToSquare.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class CircleToSquare {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = new CircleToSquareState()
    }
    draw(context) {
        context.strokeStyle = '#2980b9'
        context.lineWidth = this.size/20
        context.lineCap = 'round'
        const r = this.size/2, ax = r/Math.sqrt(2), offsetY = (r/Math.sqrt(2))*this.state.scale, by = (r)*(1-this.state.scale)
        for(var i=0;i<4;i++) {
            context.save()
            context.translate(this.x,this.y)
            context.rotate(i*Math.PI/2)
            context.beginPath()
            for(var j=45;j<=135;j++) {
                const x = r*Math.cos(j*Math.PI/180), y =  offsetY + by*Math.sin(j*Math.PI/180)
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
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class CircleToSquareState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2*this.scale
            startcb()
        }
    }
}
class CircleToSquareAnimator {
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
const initCircleToSquareStage = () => {
    const stage = new CircleToSquareStage()
    stage.render()
    stage.handleTap()
}
