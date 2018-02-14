class NShapeStage extends CanvasStage {
    constructor() {
        super()
        this.animator = new NSSAnimator()
        this.container = new NShapeContainer(this.size)
    }
    render() {
        super.render()
        if(this.container) {
            this.container.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY
            this.container.startUpdating(x, y, () => {
                this.animator.start(() => {
                    this.container.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class NSSAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
        }
    }
}
class NSSState {
    constructor() {
        this.scales = [0,0,0]
        this.dir = 0
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir *= -1
                this.prevScale = this.scales[this.j]
                if(this.j == 0) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class NShape {
    constructor(x,y,size) {
        this.x = x
        this.y = y
        this.size = size
        this.state = new NSSState()
    }
    draw(context) {
        const scales = this.state.scales
        const gap = (this.size)/(2*Math.sqrt(2))
        context.save()
        context.translate(this.x, this.y)
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(gap*scales[1]*(i*2-1),0)
            for(var j = 0; j < 2; j++) {
                context.beginPath()
                context.moveTo(0,0)
                context.lineTo(0,(size/2)*scales[0] * (j * 2 - 1))
                context.stroke()
            }
            context.save()
            context.translate(0,size/2*(i*2-1))
            context.rotate(-1*Math.PI/4*scales[2])
            context.restore()
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
class NShapeContainer {
    constructor(size) {
        this.nSize = Math.min(size.w,size.h)/6
        this.nShapes = []
    }
    draw(context) {
        context.strokeStyle = 'teal'
        this.nShapes.forEach((nShape) =>  {
            nShape.draw(context)
        })
    }
    update(stopcb) {
        this.nShapes.forEach((nShape,index) => {
            nShape.update(() => {
                this.nShapes.splice(index,1)
                if(this.nShapes.length == 0) {
                    stopcb()
                }
            })
        })
    }
    startUpdating(x,y,startcb) {
        const nShape = new NShape(x, y, nSize)
        this.nShapes.push(nShape)
        nShape.startUpdating(() =>  {
            if(this.nShapes.length == 1) {
                startcb()
            }
        })
    }
}
const initNShapeStage = () => {
    const nShapeStage = new NShapeStage()
    nShapeStage.render()
    nShapeStage.handleTap()
}
