/**
 * title: 大数据的表格
 * desc: 非常大的数据表格，里面一次性显示了2万条数据
 */

import React from 'react'
import { Table } from '../../components/index'
import { Button } from 'antd'


const BigDataTable = () =>{
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
          dataIndex: '$index',
          width: 180,
          title: '序号4',
        },{
          dataIndex: 'name',
          isEditing: true,
          title: '人员名称',
          inputWidth: 500,
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
          title: '年龄'
        }, {
          dataIndex: '$operating',
          title: '操作'
        }]}
        virtual
        loadData={async ({ page, pageSize }) => {
          const datas: any = []
          for (let i = 0; i < 20000; i++) {
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
          return true
        }}
      />
    </>
  )
}

export default BigDataTable
