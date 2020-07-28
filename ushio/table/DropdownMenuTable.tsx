/**
 * title: 右键菜单表格
 * desc: 操作一个表格的右键菜单信息
 */

import React from 'react'
import { Menu } from 'asp-antd-compatible'
import { Table } from '../../components/index'

const DropdownMenuTable = () => {
  return (
    <Table
      columns={[{
        dataIndex: 'name',
        title: '人员名称',
        sorter: true
      }, {
        dataIndex: 'six',
        title: '性别'
      }, {
        dataIndex: 'age',
        title: '年龄'
      }]}
      editingType="row"
      loadData={async ({ page, pageSize }) => {
        const datas: any = []
        for (let i = 0; i < 1; i++) {
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
      onRenderDropdownMenu={() => {
        return (
          <Menu>
            <Menu.Item
              key="demo"
            >
              这是一个右键demo
            </Menu.Item>
          </Menu>
        )
      }}
    />
  )
}

export default DropdownMenuTable
