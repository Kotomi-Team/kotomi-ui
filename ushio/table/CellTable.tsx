/**
 * title: 单元格编辑表格
 * desc: 可以在单元格内进行表格编辑
 */

import React from 'react'
import { message, Button, Input } from 'antd'
import { Table, SketchPicker } from '../../components/index'

const CellTable = () => {
  const table = React.createRef<any>()
  return (
    <>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          table.current.appendRow({
            id: new Date().getTime()
          }, false)
        }}
      >
        添加一行
      </Button>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          table.current.updateRow(0,{
            six: '未知',
            age: '未知'
          })
        }}
      >
        修改第一条数据
      </Button>
      <Button
        style={{
          marginLeft: 20
        }}
        onClick={()=>{
          table.current.reload({})
        }}
      >
        刷新数据
      </Button>
      <Table
        refExt={table}
        columns={[{
          dataIndex: 'name',
          isEditing: true,
          title: '人员名称',
          inputWidth: 500,
          inputType: () => {
            const TempInput = () => {
              return <Input />
            }
            return <TempInput />
          }
        }, {
          dataIndex: 'six',
          isEditing: true,
          title: '性别'
        }, {
          dataIndex: 'age',
          isEditing: true,
          inputModal: 'display',
          title: '年龄'
        }, {
          dataIndex: 'color',
          isEditing: true,
          inputType: <SketchPicker />,
          title: '年龄'
        }, {
          dataIndex: '$operating',
          title: '操作'
        }]}
        editingType='cell'
        loadData={async ({ page, pageSize }) => {
          const datas: any = []
          for (let i = 0; i < pageSize; i++) {
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
        onSave={async (record, type: 'DELETE' | 'UPDATE' | 'CREATE') => {
          message.info(`操作类型：${type}, 操作的数据：${JSON.stringify(record)}`)
          return true
        }}
      />
    </>
  )
}

export default CellTable
