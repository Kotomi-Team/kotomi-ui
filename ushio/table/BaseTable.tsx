/**
 * title: 基础的表格
 * desc: 一个简单的表格组件
 */

import React from 'react'
import { Table } from '../../components/index'

const BaseTable = () =>{
  return (
    <Table
      columns={[{
        dataIndex: '$index',
        title: '序号',
      },{
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
      }]}
      editingType="row"
      rowSelection="multiple"
      loadData={async ({ page, pageSize })=>{
        const datas: any = []
        for(let i =0 ;i< pageSize ; i++){
          datas.push({
            id: `${i}- ${page} `,
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
    />
  )
}

export default BaseTable
