import React from 'react'
import { Checkbox as AntCheckbox } from 'antd';
import './style/index.less'

class Checkbox extends React.Component<any> {

  public static Group = AntCheckbox.Group

  state = {
    value: this.props.value,
  }

  render() {
    // 多状态
    const extProps: any = {}
    return (
      <AntCheckbox
        {...this.props}
        {...extProps}
        checked={this.state.value}
        onChange={(e: any) => {
          this.setState({
            value: e.target.checked,
          })
          if (this.props.onChange) {
            this.props.onChange(e.target.checked)
          }
        }}
      />
    )
  }
}

export default Checkbox
