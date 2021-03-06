/**
 * title: 简单的对话框
 * desc: 一个简单的对话框，可动态控制footerButton是否显示
 */


import React from 'react'

import { Modal } from '../../components/modal/Modal';
import { Button } from 'asp-antd-compatible';

const BaseoMdal = () => {
  let modal: Modal | null = null
  const [footerButtonVisible,setFooterButtonVisible] = React.useState(false)
  return (
    <>
      <Button
        style={{
          marginTop: 200
        }}
        onClick={() => {
          setFooterButtonVisible(true)
          modal!.show()
        }}
      >  隐藏底部的按钮</Button>
       <Button
        onClick={() => {
          setFooterButtonVisible(false)
          modal!.show()
        }}
      >  显示底部的按钮</Button>
      <Modal
        ref={(_modal) => {
          modal = _modal
        }}
        footerButtonVisible={footerButtonVisible}
        title='My title is Modal'
      >
        <p> show children0 </p>
        <p> show children1 </p>
        <p> show children2 </p>
        <p> show children3 </p>
        <p> show children4 </p>
        <p> show children5 </p>
      </Modal>
    </>
  )
}

export default BaseoMdal