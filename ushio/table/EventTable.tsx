/**
 * title: 演示表格事件
 * desc: 点击事件，或者初始化事件等等... 打开F12控制台查看鼠标事件
 */

import React from 'react'
import {message} from 'antd'
import { Table } from '../../components/index'

const BaseTable = () =>{
  return (
    <Table
      columns={[{
        dataIndex: 'name',
        title: '人员名称'
      },{
        dataIndex: 'six',
        title: '性别'
      },{
        dataIndex: 'age',
        title: '年龄'
      }]}
      editingType="row"
      loadData={async ({ page, pageSize })=>{
        const datas: any = []
        for(let i =0 ;i< pageSize ; i++){
          datas.push({
            id: i,
            name: `${page} - name - ${i}`,
            six: `${page} - six - ${i}`,
            age: `${page} - age - ${i}`,
          })
        }
        return {
          dataSource: datas,
          total: 2000
        }
      }}
      onRow={()=>{
        return {
          onClick:()=>{
            message.info('触发- onClick 事件!')
          },
          onContextMenu:()=>{
            message.info('触发- onContextMenu 事件!')
          },
          onDoubleClick:()=>{
            message.info('触发- onDoubleClick 事件!')
          },
          onMouseEnter:()=>{
            console.log('触发- onMouseEnter 事件!')
          },
          onMouseLeave:()=>{
            console.log('触发- onMouseLeave 事件!')
          }
        }
      }}
    />
  )
}

export default BaseTable
