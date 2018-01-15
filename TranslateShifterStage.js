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
        context.restore()
    }
    addPoint(x,y) {
        const curr_x = x - this.x,curr_y = y - this.y
        this.j++
    }
    removePoints() {
        if(this.curr_points.length > 0 && this.j > 0) {
            this.curr_points.splice(0,1)
            this.j--
        }
    }
    updatePoints() {
        if(this.curr_points.length < this.orig_points.length) {
            this.curr_points.push(this.orig_points[this.j])
            this.j++
        }
    }
}
