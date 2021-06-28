/**
 * title: 颜色选择器
 * desc: 一个简单的颜色选择器
 */

import React from 'react'
import { Row, Col } from 'asp-antd-compatible'
import { SketchPicker as Picker } from '../../components/index';

const SketchPicker = () => {
    return (
        <div>
            <Row>
                <Col span={4}>
                    <Picker />
                </Col>
                <Col span={4}>
                    <Picker />
                </Col>
                <Col span={4}>
                    <Picker />
                </Col>
            </Row>
        </div>
    )
}

export default SketchPicker