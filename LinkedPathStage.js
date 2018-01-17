class LinkedPathStage extends CanvasStage {
    constructor() {
        super()
        this.linkedPath = new LinkedPath(200,200,300,300)
        this.mover = new LinkedPathMover(this.linkedPath)
        this.animator = new LinkedPathAnimator()
        this.animator.start(()=>{
            this.render()
        })
    }
    render() {
        super.render();
        if(this.linkedPath) {
            this.linkedPath.drawThePath(this.context)
        }
        if(this.mover) {
            this.mover.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.mover.toggleDir()
        }
    }
}
class NodePoint {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.prev = null
        this.next = null
        this.occupied = false
    }
    setOccupied() {
        this.occupied = true
    }
    addPrevPoint(point) {
        this.prev = point
    }
    addNextPoint(point) {
        this.next = point
    }
    equals(point) {
        return point.x == this.x && point.y == this.y
    }
}
class LinkedPath {
    constructor(x,y,w,h) {
        this.mainPoint = new NodePoint(x,y)
        this.initPath(x,y,w,h)
        this.currPoint = this.mainPoint
    }
    initPath(x,y,w,h) {
        var root = this.mainPoint
        const x_pos_node = this.iterateTill(x,x+w,1,root,y,0)
        const y_pos_node = this.iterateTill(y,y+h,1,x_pos_node,x+w,1)
        const x_neg_node = this.iterateTill(x+w,x,-1,y_pos_node,y+h,0)
        const y_neg_node = this.iterateTill(y+h,y,-1,x_neg_node,x,1)
        y_neg_node.addNextPoint(root)
        root.addPrevPoint(y_neg_node)
        console.log(this.mainPoint)
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
        context.lineWidth = 10
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(this.mainPoint.x,this.mainPoint.y)
        this.iterateThroughPoints(context)
    }
    getPoint(dir) {
        const point =  {x:this.currPoint.x,y:this.currPoint.y}
        if(dir == 1) {
            this.currPoint = this.currPoint.next
        }
        else {
            this.currPoint = this.currPoint.prev
        }
        return point
    }
    iterateThroughPoints(context) {
        var node = this.mainPoint
        while (true) {
            var curr = node.next
            if(curr.equals(this.mainPoint)) {
                context.stroke()
                break
            }
            context.lineTo(curr.x,curr.y)
            node = curr
        }
    }
}
class LinkedPathMover {
    constructor(path) {
        this.path = path
        this.dir = 1
    }
    draw(context) {
        const point = this.path.getPoint(this.dir)
        context.fillStyle = '#9b59b6'
        context.save()
        context.translate(point.x,point.y)
        context.beginPath()
        context.arc(0,0,10,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    toggleDir() {
        this.dir *= -1
    }
}
const initLinkedPathStage = () => {
    const stage = new LinkedPathStage()
    stage.render()
    stage.handleTap()
}
class LinkedPathAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            })
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
