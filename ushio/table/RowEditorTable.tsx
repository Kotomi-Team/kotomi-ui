/**
 * title: 行编辑的表格
 * desc: 用来行编辑的表格
 * 
 */

import React from 'react'
import { message, Button, DatePicker } from 'asp-antd-compatible'
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
        onClick={()=>{
          table.current.appendRow({
            id: new Date().getTime(),
            name: "这是一个超级超级长的名字，真的很长很长的名字"
          },false)
        }}
      >
        添加一行数据 - 不显示编辑
      </Button>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          const datas: any[] = []
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
          table.current.delRow([0,1,2,3,4,5,6,7,8,9,10], false)
        }}
      >
        删除十行
      </Button>
      <Button
        onClick={()=>{
          table.current.setRowSelectedKeys([])
        }}
      >
        清空选中
      </Button>
      <Table
        style={{
          marginTop: 10
        }}
        bordered
        refExt={table}
        columns={[{
          dataIndex: 'name',
          isEditing: () => {
            return true
          },
          title: '人员名称'
        },{
          dataIndex: 'baseInfo1',
          title: '人员基础信息一',
          isEditing: true,
          children:[{
            dataIndex: 'six',
            title: '性别',
          },{
            dataIndex: 'age',
            title: '年龄',
          },{
            dataIndex: 'endDate',
            title: '截至日期',
            inputType: <DatePicker />
          }]
        },{
          dataIndex: 'baseInfo2',
          title: '人员基础信息二',
          isEditing: true,
          children:[{
            dataIndex: 'six2',
            title: '性别',
          },{
            dataIndex: 'age2',
            title: '年龄',
          },{
            dataIndex: 'endDate2',
            title: '截至日期',
            inputType: <DatePicker />
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
