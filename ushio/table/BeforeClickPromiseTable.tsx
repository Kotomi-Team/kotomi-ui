/**
 * title: 点击特殊按钮的表格
 * desc: 演示onBeforeClickPromiseColumn的用法
 */

import React from 'react'
import { message } from 'antd'
import { Table } from '../../components/index'

const BeforeClickPromiseTable = () =>{
  return (
    <Table
      columns={[{
        dataIndex: 'name',
        title: '人员名称',
        width: 100
      },{
        dataIndex: 'six',
        title: '性别',
        width: 200
      },{
        dataIndex: 'age',
        title: '年龄',
        width: 200
      },{
        dataIndex: '$operating',
        title: '操作'
      }]}
      editingType="row"
      rowSelection="multiple"
      loadData={async ({ page, pageSize })=>{
        const datas: any = []
        for(let i =0 ;i< pageSize ; i++){
          datas.push({
            id: i,
            name: `${page} - name - ${i} - 这是一个超出的文字内容`,
            six: `${page} - six - ${i}`,
            age: `${page} - age - ${i}`,
          })
        }
        return {
          dataSource: datas,
          total: 2000
        }
      }}
      onBeforeClickPromiseColumn={async (type,record)=>{
        message.info(`type: ${type} - ${JSON.stringify(record)}`)
        return true
      }}
    />
  )
}

export default BeforeClickPromiseTable
