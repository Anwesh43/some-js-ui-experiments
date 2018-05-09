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
        this.img.onmousedown = () => {
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
                this.children.push(fnNode)
            }
        }
    }

    draw(context, px, py) {
        const x = px + (this.x - px) * this.state.scale,y = py + (this.y - py) * this.state.scale
        context.moveTo(px, py)
        context.lineTo(x, y)
        context.stroke()
        context.save()
        context.translate(x, y)
        context.beginPath()
        context.arc(0, 0, 100, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        this.children.forEach((child) => {
            child.draw(context, this.x, this.y)
        })
    }

    update(stopcb, dir) {
        this.state.update(() => {
            if (this.children.length > 0 || dir == 1) {
                this.children.startUpdating(() => {
                    stopcb()
                })
            }
            else {
                stopcb()
            }
        })
    }

    startUpdating(startcb) {
        if (this.i == 0) {
            this.childrens.forEach((child,index) => {
                child.startUpdating(() => {
                    if (index == this.childrens.length - 1) {
                        startcb()
                    }
                })
            })
        }
        else {
            startcb()
        }
    }
}

class FNTree {
    draw(context, w, h) {
        if (!this.curr) {
            this.curr = new FNNode(0, 100, 100, w/ FN_LEVEL, h/(FN_LEVEL * 3))
            this.dir = 1
        }
        this.curr.draw(context, 100, 100)
    }

    update(stopcb) {
        this.curr.update(stopcb, this.dir)
    }

    startUpdating(startcb) {
        this.curr.startUpdating(startcb)
    }
}


const initTreeFolderStage = () => {
    const stage = new TreeFolderStage()
    stage.render()
    stage.handleTap()
}
