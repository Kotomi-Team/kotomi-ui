/**
 * title: 一列的Form
 * desc: 将Form的表单进行一列布局
 */

import { InputNumber } from 'asp-antd-compatible'
import React from 'react'
import { Form } from '../../components/index'

const BaseForm = () => {
  return (
    <Form
      script={`
        [name|Field1 number 8-8-16][code|Field2 input 8-8-16 ][code1|Field3 input 8-8-16] 
      `}
      initialValues={{
        name: 0
      }}
      components={[{
        name:'number',
        component: <InputNumber />
      }]}
    />
  )
}

export default BaseForm