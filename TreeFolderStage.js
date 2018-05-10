const FN_LEVEL = 4
class TreeFolderStage extends CanvasStage {
    constructor() {
        super()
        this.fnTree = new FNTree()
        this.animator = new FNAnimator()
    }

    render() {
        super.render()
        if (this.fnTree) {
            this.fnTree.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.fnTree.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.fnTree.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class FNState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class FNAnimator {
    constructor() {
        this.animated = false
    }

    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class FNNode {

    constructor(i, x, y, ew, eh) {
        this.x = x
        this.y = y
        this.i = i
        this.children = []
        this.addChildren(ew, eh)
        this.state = new FNState()
    }

    addChildren(ew, eh) {
        if (this.i < FN_LEVEL - 1) {
            for (var i = 0; i < 3; i++) {
                const fnNode = new FNNode(this.i+1, this.x + ew, this.x + eh * i ,ew, eh)
                fnNode.parent = this
                this.children.push(fnNode)
            }
        }
    }

    draw(context, px, py, r) {

        context.fillStyle = '#e74c3c'
        const x = px + (this.x - px) * this.state.scale,y = py + (this.y - py) * this.state.scale
        context.moveTo(px, py)
        context.lineTo(x, y)
        context.stroke()
        context.save()
        context.translate(x, y)
        context.beginPath()
        context.arc(0, 0, r, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }

    update(stopcb) {
        this.state.update(() => {
            console.log(this.i)
            stopcb(this.children)
        })
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

class FNTree {
    constructor() {
        this.currs = []
    }
    draw(context, w, h) {
        var r = h / (FN_LEVEL*10)
        if (!this.root) {
            this.root = new FNNode(0, r, r, w/ FN_LEVEL, h/(FN_LEVEL * 3))
            this.dir = 1
            this.currs.push(this.root)
        }
        this.currs.forEach((curr)=>{
            var x = curr.parent ? curr.parent.x : r, y = curr.parent? curr.parent.y : r
            curr.draw(context, x, y, r)
        })
    }

    update(stopcb) {
        var i = 0, k = this.currs.length
        this.currs.forEach((curr) => {
            curr.update((children) => {
                children.forEach((child) => {
                    this.currs.push(child)
                })
                this.currs.splice(0, 1)
                i++
                console.log(i)
                if (i == k) {
                    stopcb()
                }
            })
        })
    }

    startUpdating(startcb) {
        if (this.currs.length == 1) {
            this.currs.forEach((curr)=>{
                curr.children.forEach((curr) => {
                    this.currs.push(curr)
                })
            })
            this.currs.splice(0,1)
        }
        this.currs.forEach((curr) => {
            curr.startUpdating(startcb)
        })
    }
}


const initTreeFolderStage = () => {
    const stage = new TreeFolderStage()
    stage.render()
    stage.handleTap()
}
