import React from 'react';
import { SketchPicker as ReactSketchPicker, Color, ColorResult } from 'react-color';

type Props = {

    /**
     * 当前颜色值
     */
    color?: string

    /**
     * 颜色选择器的宽度
     */
    width?: string | number

    /**
     * 选择颜色后触发的事件
     */
    onChange?: (color: Color) => void,
}

type State = {
    color?: Color
    visible: boolean,
}

/**
 * 颜色选择器
 */
export class SketchPicker extends React.Component<Props, State>{

    static defaultProps = {
        width: '56px',
    }

    state = {
        color: undefined,
        visible: false,
    }

    componentDidMount() {
    }

    render() {
        const { color } = this.props
        const { color: stateColor, visible } = this.state
        const realColor = stateColor ? stateColor : color
        return (
            <>
                <div
                    style={{
                        padding: '5px',
                        background: '#fff',
                        borderRadius: '1px',
                        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                        display: 'inline-block',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        this.setState({
                            visible: !visible,
                        })
                    }}
                >
                    <div
                        style={{
                            width: this.props.width,
                            height: '14px',
                            borderRadius: '2px',
                            background: realColor,
                        }}
                    />
                </div>
                {visible ? (
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px',
                            }}
                            onClick={() => {
                                this.setState({
                                    visible: !visible,
                                })
                            }}
                        />
                        <div
                            style={{
                                zIndex: 1000,
                                position: 'absolute',
                                width: 200,
                            }}
                        >
                            <ReactSketchPicker
                                color={realColor}
                                onChange={(colorResult: ColorResult) => {
                                    if (this.props.onChange) {
                                        this.props.onChange(colorResult.hex)
                                    }
                                    this.setState({
                                        color: colorResult.hex,
                                    })
                                }}
                            />
                        </div>
                    </>
                ) : undefined}
            </>
        )
    }

}
