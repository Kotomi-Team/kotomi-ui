/**
 * title: 高级查询构建器
 * desc: 用来做查询构建
 */

import React, { useRef } from 'react'
import { QueryBuild } from '../../components/query/QueryBuild'
import { Button, message } from 'antd'

const BaseForm = () => {
  const querybuild = useRef()
 
  return (
    <>
      <Button
        onClick={()=>{
          // @ts-ignore 
          const info = querybuild.current.getQueryJSON()
          message.info(JSON.stringify(info))
          console.log(info)
        }}
      >
        获取查询信息
      </Button>
      <QueryBuild
        // @ts-ignore 
        ref={(refSelf: undefined)=>{
          querybuild.current = refSelf
        }}
        fields={[{
          name: 'name',
          title: '人员名称'
        }]}
        symbols={['包含','不包含','等于','不等于']}
      />
    </>
  )
}

export default BaseForm