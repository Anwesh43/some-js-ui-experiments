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
class LinkedPath {
    constructor(x,y,w,h) {
        this.mainPoint = new NodePoint(x,y)
        this.initPath(x,y,w,h)
    }
    initPath(x,y,w,h) {
        var root = this.mainPoint
        const x_pos_node = this.iterateTill(x,x+w,1,root,y,0)
        const y_pos_node = this.iterateTill(y,y+h,1,x_pos_node,x+w,1)
        const x_neg_node = this.iterateTill(x+w,x,-1,y_pos_node,y+h,0)
        const y_neg_node = this.iterateTill(y+h,y,-1,x_neg_node,x,1)
        y_neg_node.addNextPoint(root)
        root.addPrevPoint(y_neg_node)
    }
    iterateTill(start,end,dir,root,fixed,mode) {
        var node = root
        var i = start
        while(true) {
            i += dir
            var curr = new NodePoint(i,fixed)
            if(mode == 1) {
                curr = new NodePoint(fixed,i)
            }
            node.addNextPoint(curr)
            curr.addPrevPoint(node)
            node = curr
            if(i == end) {
                break
            }
        }
        return node
    }
    drawThePath(context) {
        context.strokeStyle = '#7f8c8d'
        context.beginPath()
        context.moveTo(this.movePoint.x,this.movePoint.y)
        this.iterateThroughPoints(context)
    }
    iterateThroughPoints(context) {
        var node = this.movePoint
        while (true) {
            var curr = node.next
            if(curr == this.movePoint) {
                context.stroke()
                break
            }
            context.lineTo(curr.x,curr.y)
            node = curr
        }
    }
}
