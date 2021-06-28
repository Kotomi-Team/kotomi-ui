import React from 'react'
import { Button } from 'asp-antd-compatible'
import { Canvas } from '../../components/draw/Canvas';

const DrawFlow = () => {
    const canvas = React.createRef<Canvas>()
    const div0 = React.createRef<HTMLDivElement>()
    const div1 = React.createRef<HTMLDivElement>()
    const div2 = React.createRef<HTMLDivElement>()
    return (
        <>
            <Button onClick={() => {
                const divInfo0 = canvas.current!.getPositionByElement(div0.current!)
                const divInfo1 = canvas.current!.getPositionByElement(div1.current!)
                const divInfo2 = canvas.current!.getPositionByElement(div2.current!)
                canvas.current!.paintBezierLine({
                    x: divInfo0.x + divInfo0.width!,
                    y: divInfo0.y + (divInfo0.height! / 2),
                }, {
                    x: divInfo1.x,
                    y: divInfo1.y + (divInfo1.height! / 2),
                })
                canvas.current!.paintBezierLine({
                    x: divInfo0.x + divInfo0.width!,
                    y: divInfo0.y + (divInfo0.height! / 2),
                }, {
                    x: divInfo2.x,
                    y: divInfo2.y + (divInfo2.height! / 2),
                })
                console.log(divInfo0)
                console.log(divInfo1)
            }}>点击测试绘画</Button>
            <Canvas
                ref={canvas}
            >
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <div
                        ref={div0}
                        style={{
                            border: "1px solid #1890ff",
                            width: 40,
                            height: 500,
                        }}
                    >你好</div>

                    <div
                        ref={div1}
                        style={{
                            border: "1px solid #1890ff",
                            width: 40,
                            marginLeft: 200,
                            height: 22
                        }}
                    >再见0</div>

                    <div
                        ref={div2}
                        style={{
                            border: "1px solid #1890ff",
                            width: 40,
                            marginLeft: 200,
                            height: 22
                        }}
                    >再见1</div>
                </div>
            </Canvas>
        </>
    )
}

export default DrawFlow