/**
 * title: 颜色选择器
 * desc: 一个简单的颜色选择器
 */

import React from 'react'
import { Tabs }  from 'antd'
import { SketchPicker as Picker } from '../../components/index';
const TestPickerBug = () => {
    return (
        <Tabs>
            <Tabs.TabPane
              tab="Tab 1"
              key="1"
            >
              <Picker />
              <div style={{height: 800}}/>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default TestPickerBug