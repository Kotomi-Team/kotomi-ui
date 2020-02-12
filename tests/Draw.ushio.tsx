import React from 'react'
import { Button } from 'antd'
import { Canvas } from '../components/draw/Canvas';


export default { title: 'Draw' };


export const baseTree = () => {
    const canvas = React.createRef<Canvas>()
    return (
        <>
            <Button onClick={()=>{
                canvas.current!.paintLineByClassName('from','to')
            }}>点击测试绘画</Button>
            <Canvas
                ref={canvas}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div 
                        className="from"
                        style={{
                            border: "1px solid #1890ff",
                            width: 40,
                            height: 22
                        }}
                    >你好</div>

                    <div 
                        className="to"
                        style={{
                            border: "1px solid #1890ff",
                            width: 40,
                            marginLeft: 200,
                            height: 22
                        }}
                    >再见</div>

                </div>
            </Canvas>
        </>
    )
}