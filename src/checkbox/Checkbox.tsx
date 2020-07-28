import React, { useState } from 'react'
import { Checkbox as AntCheckbox } from 'asp-antd-compatible';

import './style/index.less'

const Checkbox = (props: any) => {
  const [value, setValue] = useState(props.value)

  return (
    <AntCheckbox
      {...props}
      className={ value === undefined ? 'kotomi-ext-checkbox' : undefined}
      checked={value || false}
      onChange={() => {
        let tempValue;
        if (value === undefined) {
          tempValue = false
        }

        if (value === false) {
          tempValue = true
        }

        if (value === true) {
          tempValue = undefined
        }
        // 自定义拦截顺序
        if (props.onBeforeChange) {
          tempValue = props.onBeforeChange(tempValue)
        }
        setValue(tempValue)
        if (props.onChange) {
          props.onChange(tempValue)
        }
      }}
    />
  )
}

export default Checkbox;
