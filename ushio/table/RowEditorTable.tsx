/**
 * title: 行编辑的表格
 * desc: 用来行编辑的表格
 * 
 */

import React from 'react'
import { message } from 'antd'
import { Table } from '../../components/index'

const RowEditorTable = () =>{
  return (
    <Table
      columns={[{
        dataIndex: 'name',
        isEditing: true,
        title: '人员名称'
      },{
        dataIndex: 'six',
        isEditing: true,
        title: '性别'
      },{
        dataIndex: 'age',
        isEditing: true,
        inputModal: 'display',
        title: '年龄'
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
      onSave={async ( record, type: 'DELETE' | 'UPDATE' | 'CREATE')=>{
        message.info(`操作类型：${type}, 操作的数据：${JSON.stringify(record)}`)
        return true
      }}
    />
  )
}

export default RowEditorTable
