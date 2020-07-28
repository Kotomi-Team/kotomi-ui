/**
 * title: 高级查询构建器
 * desc: 用来做查询构建
 */

import React, { useRef } from 'react'
import { QueryBuild } from '../../components/query/QueryBuild'
import { Button, message, Select, Input } from 'asp-antd-compatible'

const TempInput = (props: any) => {
  return <Input
    value={props.value}
    onChange={(e) => {
      props.onChange(e.target.value)
    }} 
  />
}

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

      <Button
        onClick={() => {
            // @ts-ignore 
           const info = querybuild.current.getQueryJSON()
           window.localStorage.setItem('QUERY_BUILD', JSON.stringify(info))
        }}
      >
          保存构建信息
      </Button>

      <Button
        onClick={() => {
            // @ts-ignore 
           const info = querybuild.current.getQueryJSON()
           // @ts-ignore 
           querybuild.current.setQueryJSON(JSON.parse(window.localStorage.getItem('QUERY_BUILD')))
        }}
      >
          装载构建信息
      </Button>
      <QueryBuild
        // @ts-ignore 
        ref={(refSelf: undefined)=>{
          querybuild.current = refSelf
        }}
        onChangeField={(field) => {
          if(field === 'six'){
            return (
              <Select defaultValue="0">
                <Select.Option value="0">女</Select.Option>
                <Select.Option value="1">男</Select.Option>
              </Select>
            )
          }
          return <TempInput />;
        }}
        fields={[{
          name: 'name',
          title: '人员名称'
        },{
          name: 'six',
          title: '年龄'
        }]}
        symbols={['包含','不包含','等于','不等于']}
      />
    </>
  )
}

export default BaseForm