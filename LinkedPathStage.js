class LinkedPathStage extends Stage {
    constructor() {
        super()
    }
    render() {
        super.render();
    }
}
class NodePoint {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.prev = null
        this.next = null
    }
    addPrevPoint(point) {
        this.prev = point
    }
    addNextPoint(point) {
        this.next = point
    }
}
