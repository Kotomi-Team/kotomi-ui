/**
 * title: 动态输入框
 * desc: 可动态变化Form表单的输入框类型
 */

import React from 'react'
import { Form } from '../../components/index'


const InputForm = () => {
  return (
    <>
      <Form
        script={`
          [name| input 8-8-16][code|Field2 input 8-8-16 ][code1|Field3 input 8-8-16] 
        `}
      />
    </>
  )
}

export default InputForm