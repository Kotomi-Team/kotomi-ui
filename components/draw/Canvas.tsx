import React from 'react'
import ReactDom from 'react-dom'
import "./style/index"

/**
 * 位置信息
 */
type Position = {
    x: number
    y: number
    height?: number
    width?: number
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
     * 绘制贝塞尔曲线
     * @param line 画出对应的线
     */
    public paintBezierLine(from: Position,to: Position):void{
        const controlPoint: Position =  {x: from.x, y: to.y * 2 }
        const ctx2d = this.canvasElement.current!.getContext('2d')!
        ctx2d.beginPath()
        ctx2d.moveTo(from.x,from.y)
        ctx2d.quadraticCurveTo(controlPoint.x,controlPoint.y,to.x,to.y)
        ctx2d.stroke()
    }

    /**
     * 获取当前HTML元素的坐标信息
     * @param element 当前HTML元素
     */
    public getPositionByElement(element: HTMLElement):Position{
        return {
            x: element.offsetLeft - this.canvasElement.current!.offsetLeft,
            y: element.offsetTop - this.canvasElement.current!.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        }
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