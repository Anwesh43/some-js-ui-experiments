class NotificationStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class NotificationText {
    constructor(x,y,w,text) {
        this.y = y
        this.x = x
        this.w = w
        this.text = text
        this.textParts = []
    }
    draw(context) {
        const x = this.x,w = this.w
        context.font = context.font.replace(/\d/g,20)
        if(this.textParts.length == 0) {
            var msg = ""
            var words = this.text.split(" ")
            var y = 20
            for(var i=0;i<words.length;i++) {
                if(context.measureText(msg+words[i]).width > 0.9*w) {
                    this.textParts.push(new TextPart(msg,y))
                    y += 40
                }
                else {
                    msg = msg+words[i]
                }
            }
            y += 40
            this.h = y
        }
        context.save()
        context.translate(x,this.y)
        context.beginPath()
        context.rect(w/2-w/2,0,w/2+w/2,this.h)
        context.clip()
        context.save()
        context.globalAlpha = 0.7
        context.fillStyle = '#2ecc71'
        context.fillRect(0,0,w,this.h)
        context.restore()
        this.textParts.forEach((textPart) => {
            textPart.draw(context,w/20)
        })
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
class TextPart {
    constructor(text,y) {
        this.text = text
        this.y = y
    }
    draw(context,x) {
        context.fillStyle = 'white'
        context.fillText(this.text,x,this.y)
    }
}
