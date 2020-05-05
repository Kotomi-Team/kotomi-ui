/**
 * title: 行编辑的表格
 * desc: 用来行编辑的表格
 * 
 */

import React from 'react'
import { message, Button } from 'antd'
import { Table } from '../../components/index'

const table = React.createRef<any>()
const RowEditorTable = () =>{
  return (
    <>
      <Button
        onClick={()=>{
          table.current.appendRow({
            id: new Date().getTime()
          })
        }}
      >
        添加一行数据 - 直接显示可编辑
      </Button>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          const datas = []
          for(let i=0;i< 20; i++){
            datas.push({
              id: 50 + 1 
            })
         
          }
          table.current.appendRow(datas, false)
        }}
      >
        添加20行数据 - 不显示可编辑
      </Button>
      <Button
        onClick={()=>{
          console.log(table.current.getSelectRowKeys())
        }}
      >
        获取选中的数据
      </Button>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          table.current.delRow(0)
        }}
      >
        删除一行
      </Button>

      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          table.current.delRow([0,1,2,3,4,5,6,7,8,9], false)
        }}
      >
        删除十行
      </Button>
      <Table
        style={{
          marginTop: 10
        }}
        refExt={table}
        columns={[{
          dataIndex: 'name',
          isEditing: true,
          title: '人员名称'
        },{
          dataIndex: 'baseInfo',
          title: '人员基础信息',
          isEditing: true,
          children:[{
            dataIndex: 'six',
            title: '性别',
          },{
            dataIndex: 'age',
            title: '年龄',
          },{
            dataIndex: 'color',
            title: '颜色',
          }]
        },{
          dataIndex: '$operating',
          title: '操作'
        }]}
        editingType='row'
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
        rowSelection="multiple"
        onSave={async ( record, type: 'DELETE' | 'UPDATE' | 'CREATE')=>{
          message.info(`操作类型：${type}, 操作的数据：${JSON.stringify(record)}`)
          return true
        }}
      />
    </>
  )
}

export default RowEditorTable
