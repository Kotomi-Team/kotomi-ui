/**
 * title: 动态输入框
 * desc: 可动态变化Form表单的输入框类型
 */

import React from 'react'
import { Input, Radio, Row } from 'asp-antd-compatible'
import { Form } from '../../components/index'


const InputForm = () => {
  const [value,setValue] = React.useState(0)
  const type = value === 0 ? 'password': 'input'
  return (
    <>
      <Row>
        <Radio.Group
          style={{
            marginBottom: 20
          }}
          onChange={(e: any)=>{
            setValue(e.target.value)
          }} 
          value={value}>
          <Radio value={0}>密码输入框</Radio>
          <Radio value={1}>文本输入框</Radio>
        </Radio.Group>
      </Row>
      <Row>
        <Form
          script={`
            [name|Field1 ${type} 8-8-16][code|Field2 ${type} 8-8-16 ][code1|Field3 ${type} 8-8-16] 
          `}
          components={value === 1? [] : [{
            name: 'password',
            component: <Input.Password />
          }]}
        />
      </Row>
    </>
  )
}

export default InputForm