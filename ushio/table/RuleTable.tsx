/**
 * title: 可校验表格
 * desc: 对表格输入的内容进行校验
 */

import React from 'react'
import { Input } from 'asp-antd-compatible'
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
        width: 100,
        inputModal: 'display',
        inputType:  () => {
          return <Input />
        },
        isEditing: true,
        rules: [{
            required: true,
            message: '这个是一个超级.....................................长的校验信息。'
        }]
      },{
        dataIndex: 'name2',
        title: '人员名称2',
        width: 100,
        isEditing: true,
        rules: [{
            required: true,
            message: '这个是一个超级.....................................长的校验信息。'
        }]
      },{
        dataIndex: '$operating',
        title: '操作'
      }]}
      editingType="cell"
      rowSelection="multiple"
      loadData={async ({ page, pageSize })=>{
        const datas: any = []
        for(let i =0 ;i< 2 ; i++){
          datas.push({
            id: `${i}- ${page} `,
            name: `${page} - name - ${i} - 这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容,这是一个超出的文字内容`,
            six: `${page} - six - ${i}`,
            age: `${page} - age - ${i}`,
          })
        }
        return {
          dataSource: datas,
          total: pageSize
        }
      }}
    />
  )
}

export default BaseTable
