class BouncingBallStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class Vector {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    add(v) {
        this.x += v.x
        this.y += v.y
    }
    reverseX() {
        this.x *= -1
    }
    reverseY() {
        this.y *= -1
    }
}
