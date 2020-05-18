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
        width: 80
      },{
        dataIndex: 'baseInfo',
        title: '人员基础信息',
        children:[{
            dataIndex: 'six',
            title: '性别',
            width: 80
        },{
            dataIndex: 'age',
            title: '年龄',
            width: 200
        }]
      }]}
      editingType="row"
      rowSelection="multiple"
      loadData={async ({ page, pageSize })=>{
        const datas: any = []
        for(let i =0 ;i< 2 ; i++){
          datas.push({
            id: `${i}- ${page} `,
            name: `@！#@#@@！#&……#&*@&￥@*&#@&#`,
            six: `@！#@#@@！#&……#&*@&￥@*&#@&#`,
            age: `${page} - age - ${i}`,
          })
        }
        return {
          dataSource: datas,
          total: 2
        }
      }}
    />
  )
}

export default BaseTable
