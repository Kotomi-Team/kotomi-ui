/**
 * title: 高级查询构建器的预设
 * desc: 用来做查询构建
 */

import React from 'react'
import { QueryBuildPreset } from '../../components/query/QueryBuild'
import { Select, Input } from 'asp-antd-compatible'

const TempInput = (props: any) => {
  return <Input
    value={props.value}
    onChange={(e) => {
      props.onChange(e.target.value)
    }} 
  />
}

const PresetQueryBuild = () => {
 
  return (
    <>
      <QueryBuildPreset
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

export default PresetQueryBuild