class CircleToSquareStage extends CanvasStage {
    constructor() {
        super()
        this.circleToSquare = new CircleToSquare()
        this.animator = new CircleToSquareAnimator()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.circleToSquare.startUpdating(() => {
                this.animator.start(() => {
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
        const r = this.size/2, ax = r/Math.sqrt(2), by = r - r/Math.sqrt(2)
        for(var i=0;i<4;i++) {
            context.save()
            context.translate(this.x,this.y)
            context.rotate(i*Math.PI/2)
            context.beginPath()
            for(var j=0;j<=180;j++) {
                const x = ax*Math.cos(j*Math.PI/180), y = by*Math.sin(j*Math.PI/180)
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
            this.scale = 1 - 2*this.dir
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
