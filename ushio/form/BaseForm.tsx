/**
 * title: 一列的Form
 * desc: 将Form的表单进行一列布局
 */

import React from 'react'
import { Form } from '../../components/index'

const BaseForm = () => {
  return (
    <Form
      script={`
        [name|Field1 input 8-8-16][code|Field2 input 8-8-16 ][code1|Field3 input 8-8-16] 
      `}
    />
  )
}

export default BaseForm