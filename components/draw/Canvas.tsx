import React from 'react'
import ReactDom from 'react-dom'
import "./style/index"

/**
 * 位置信息
 */
type Position = {
    x: number
    y: number
}

/**
 * 绘制对应的曲线
 */
type Line = {
    // 起始位置 P1
    p0: Position
    // 控制点   P2
    p1: Position
    // 控制点   P3
    p2: Position
    // 结束位置 P4
    p3: Position
}

type Props = {
}

/**
 * 画布
 */
export class Canvas extends React.Component<Props> {

    private canvasElement:React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>()
    private childrenElement:React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    componentDidMount(){
        const offsetHeight = this.childrenElement!.current!.offsetHeight
        const offsetWidth =this.childrenElement!.current!.offsetWidth
        const style = `
            top:-${offsetHeight}px;
        `
        this.canvasElement.current!.setAttribute('width',`${offsetWidth}px`)
        this.canvasElement.current!.setAttribute('height',`${offsetHeight}px`)
        this.canvasElement.current!.setAttribute('style',style)
        
        const element = ReactDom.findDOMNode(this) as Element
        element.setAttribute('style',`height:${offsetHeight}px;`)
    }

    /**
     * 绘画出对应的线
     * @param line 画出对应的线
     */
    public paintLine(line: Line):void{
    }

    /**
     * 根据ClassName来进行画线
     * @param from 来源的className
     * @param to   指向的ClassName
     */
    public paintLineByClassName(from: Element ,to:Element): void{
        const cxt = this.canvasElement.current!.getContext('2d')!
        cxt.moveTo(10,10);
        cxt.lineTo(150,50);
        cxt.lineTo(10,50);
        cxt.stroke();
    }

    render(){
        const { children } = this.props
        return (
            <div>
                <div
                    ref={this.childrenElement}
                >
                    {children}
                </div>
                <canvas 
                    ref={this.canvasElement}
                    className="kotomi-draw-canvas"
                />
            </div>
        )
    }
}