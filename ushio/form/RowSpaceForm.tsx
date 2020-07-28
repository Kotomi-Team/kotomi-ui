/**
 * title: 行间距的Form表单
 * desc: 可动态调整行间距的表单
 */

import React from 'react'
import { InputNumber, Row } from 'asp-antd-compatible'
import { Form } from '../../components/index'

const RowSpaceForm = () => {
  const [value,setValue] = React.useState(24)
  return (
    <>
    <Row>
      <div
        style={{
          paddingBottom: 20
        }}
      >
      <span>
        调整间距:
        </span>
        <InputNumber
          value = {value}
          onChange={(val)=>{
            setValue(val!)
          }}
        />
      </div>
    </Row>
    <Form
        script={`
          [name0|name0 input 12-8-16][code0|code0 input 12-8-16 ]
          [name1|name1 input 12-8-16][code1|code1 input 12-8-16 ]
          [name2|name2 input 12-8-16][code2|code2 input 12-8-16 ]
          [name3|name3 input 12-8-16][code3|code3 input 12-8-16 ]
          [name4|name4 input 12-8-16][code4|code4 input 12-8-16 ]
        `}
        rowSpace={value}
      />
    </>
  )
}

export default RowSpaceForm