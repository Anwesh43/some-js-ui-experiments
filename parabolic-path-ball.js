class ParabolicPathStage extends CanvasStage{
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {

        }
    }
}
class ParabolicPath {
    constructor(x,y) {
        this.points = []
    }
    draw(context) {

    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
class ParabolicState {
    constructor() {
        this.x = 0
        this.y = 0
        this.dir = 0
    }
    update(updatecb) {
        this.x+=dir
        this.y = this.x*this.x
        if(this.x >= 10) {
            this.dir = -1
        }
        if(this.x < = 0) {
            this.dir = 0
        }
        updatecb(this.x,this.y)
    }
    startUpdating() {
        if(this.dir == 0) {
            this.dir = 1
        }
    }
}
