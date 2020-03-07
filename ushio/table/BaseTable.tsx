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
      rowSelection="multiple"
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
    />
  )
}

export default BaseTable
