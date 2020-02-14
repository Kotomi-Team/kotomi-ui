import React from 'react'
import { Modal as AntModal } from 'antd'

type Props = {

  // 按钮的标题
  title: string

  // 按钮的确认事件
  onConfirm: (self: Modal) => Promise<boolean>

  // 按钮取消事件，非必须
  onCancel?: (self: Modal) => Promise<boolean>

  width?: string | number,
}

type State = {
  // 确认按钮加载的状态
  loading: boolean

  // 是否显示当前状态
  visible: boolean,
}

export class Modal extends React.Component<Props, State> {

  static defaultProps = {
    title: '',
    width: 416,
  }

  state = {
    loading: false,
    visible: false,
  }

  hide() {
    this.setState({
      visible: false,
      loading: false,
    })
  }

  // 可以使用then来进行等待方法执行完成
  async show() {
    this.setState({
      visible: true,
      loading: false,
    })
  }

  render() {
    const { loading, visible } = this.state
    const { title, children , onConfirm, onCancel, width } = this.props
    return (
      <AntModal
        title={title}
        confirmLoading={loading}
        visible={visible}
        onCancel={() => {
          const self = this
          if (onCancel) {
            onCancel(self).then((respState) => {
              if (respState === true) {
                self.hide()
              }
            })
          }else {
            // 默认逻辑点击取消隐藏
            self.hide()
          }
        }}
        width={width}
        maskClosable={false}
        onOk={() => {
          const self = this
          if (onConfirm) {
            self.setState({
              loading: true,
            })
            onConfirm(self).then((respState) => {
              if (respState === true) {
                self.hide()
              }
            })
          }
        }}
      >
        {children}
      </AntModal>
    )
  }
}
