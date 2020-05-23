/**
 * title: 富文本编辑器
 * desc: 一个简单的富文本编辑器
 */
import React from 'react'
import { RichEditor as TempRichEditor } from '../../components/index'

const RichEditor = () => {
    return <TempRichEditor onChange={(context: any)=>{ console.log(context)}}/>
}

export default RichEditor