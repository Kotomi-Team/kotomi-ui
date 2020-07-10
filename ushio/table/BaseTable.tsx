/**
 * title: 基础的表格
 * desc: 一个简单的表格组件
 */

import React from 'react'
import { Table } from '../../components/index'
import { Button } from 'antd'


const BaseTable = () =>{
  const table = React.createRef<any>()
  return (
    <>
      <Button onClick={()=>{
        table.current.reload({type: 'zeno'})
      }}>清空</Button>
       <Button onClick={()=>{
        table.current.reload({})
      }}>加载</Button>
      <Table
        refExt={table}
        columns={[{
          dataIndex: '$index',
          width: 180,
          title: '序号',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号1',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号2',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号3',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号4',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号5',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号6',
        },{
          dataIndex: '$index',
          width: 180,
          title: '序号7',
        },{
          dataIndex: 'name',
          title: '人员名称',
          width: 180
        },{
          dataIndex: 'baseInfo',
          title: '人员基础信息',
          width: 280,
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
        loadData={async ({ page, pageSize ,param})=>{
          const datas: any = []
          for(let i =0 ;i< pageSize ; i++){
            datas.push({
              id: `${i}- ${page} `,
              name: `@！#@#@@！#&……#&*@&￥@*&#@&#`,
              six: `@！#@#@@！#&……#&*@&￥@*&#@&#`,
              age: `${page} - age - ${i}`,
            })
          }
          if(param.type === 'zeno'){
            return {
              dataSource: [],
              total: 0
            }
          } 
          return {
            dataSource: datas,
            total: 3
          }
        }}
      />
    </>
  )
}

export default BaseTable
