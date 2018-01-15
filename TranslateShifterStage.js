class TranslateShifter extends CanvasStage {
    constructor() {
        super()
    }
    render(){
       super.render()
    }
}
class TranslateShifter {
    constructor() {
        this.orig_points = []
        this.curr_points = []
        this.j = 0
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
                this.x = prevPoints[0].x
                this.y = prevPoints[0].y
            }
        }
    }
    updatePoints() {
        if(this.curr_points.length < this.orig_points.length) {
            this.curr_points.push(this.orig_points[this.j])
            this.j++
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
