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

    }
    startUpdating(startcb) {

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
