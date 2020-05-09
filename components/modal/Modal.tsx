import React from 'react'
import { Modal as AntModal } from 'antd'
import ReactDOM from 'react-dom'

import './style/index.less'

type Props = {

  // 按钮的标题
  title: string

  // 底部按钮是否不可见，默认为false可见
  footerButtonVisible: boolean

  // 按钮的确认事件
  onConfirm?: (self: Modal) => Promise<boolean>

  // 按钮取消事件，非必须
  onCancel?: (self: Modal) => Promise<boolean>

  // 是否点击关闭的时候销毁弹出框
  destroyOnClose: boolean;

  // 是否显示遮挡框
  mask?: boolean;

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
    footerButtonVisible: false,
    destroyOnClose: true,
    mask: true,
  }

  state = {
    loading: false,
    visible: false,
  }
  private thisDom = React.createRef<Element>()
  private antModal: any = undefined
  // 是否移动
  private isMove: boolean | undefined = undefined

  componentDidUpdate() {
    setTimeout(() => {
      const dom: Element = ReactDOM.findDOMNode(this.thisDom.current!) as Element
      if (dom !== null && this.props.mask === false) {
        const antModalHeader = dom.getElementsByClassName('ant-modal-header')[0]
        this.antModal = dom.getElementsByClassName('ant-modal')[0]
        antModalHeader.addEventListener('mouseup', this.mouseup)
        antModalHeader.addEventListener('mousedown', this.mousedown)
        dom.addEventListener('mousemove', this.mousemove)
      }
    }, 800)
  }

  componentWillUnmount() {
    if (this.isMove !== undefined) {
      const dom: Element = ReactDOM.findDOMNode(this.thisDom.current!) as Element
      dom.removeEventListener('mousemove', this.mousemove)
    }
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
    const { title, children , onConfirm, onCancel, width, footerButtonVisible } = this.props
    const defaultModalProps: any = {}
    if (footerButtonVisible) {
      defaultModalProps.footer = null
    }
    return (
      <AntModal
        title={title}
        confirmLoading={loading}
        visible={visible}
        width={width}
        ref={this.thisDom}
        maskClosable={false}
        mask={this.props.mask}
        destroyOnClose={this.props.destroyOnClose}
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
              // fix https://github.com/Kotomi-Team/kotomi-ui/issues/46
              self.setState({
                loading: false,
              })
            })
          }
        }}
        onCancel={() => {
          const self = this
          if (onCancel) {
            onCancel(self).then((respState) => {
              if (respState === true) {
                self.isMove = undefined
                self.hide()
              }
            })
          }else {
            // 默认逻辑点击取消隐藏
            self.hide()
          }
        }}
        {...defaultModalProps}
      >
        {children}
      </AntModal>
    )
  }
  private mouseup = () => {
    this.isMove = false
  }

  private mousedown = () => {
    this.isMove = true
  }

  private mousemove = (e: any) => {
    if (this.isMove) {
      const width = this.antModal.offsetWidth
      const left = e.clientX - (parseInt(width, 10) / 2)
      const top = e.clientY - 30
      this.antModal.setAttribute('style', `left: ${left}px; top: ${top}px;  margin: 0;width: ${this.antModal.style.width}`)
    }
  }
}
