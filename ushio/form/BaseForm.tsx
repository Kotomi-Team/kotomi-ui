import React from 'react'
import { Form } from '../../components/index'
import { Input } from 'antd'

const BaseForm = () => {
  return (
    <Form
      script={`
              [name|Field1 drop 8-8-16]        [code|Field2 input 8-8-16 ]        [code1|Field3 input 8-8-16] 
              [name1|Field4 input 8-8-16]       [code2|Field5 input 16-2-22]
              [name2|Field6 input 16-2-22] [code3|Field7 input 8-2-22]
          `}
      rules={[{
        name: 'name',
        rules: [{ required: true, message: '请输入用户名' }]
      }]}
      components={[{
        name: 'drop',
        component: <Input />
      }]}
      onValuesChange={(changedValues: any, allValues: any) => {
        console.log(changedValues)
        console.log(allValues)
      }}
    />
  )
}

export default BaseForm