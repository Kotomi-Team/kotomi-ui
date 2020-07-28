/**
 * title: 单元格编辑表格
 * desc: 可以在单元格内进行表格编辑
 */

import React from 'react'
import { message, Button, Input } from 'asp-antd-compatible'
import { Table, SketchPicker } from '../../components/index'



class CellTable extends React.Component {
  state = {
    disable: true
  }
  private table = React.createRef<any>()
  
  render(){
    const self = this
    return (
        <>
          <Button
            style={{
              marginLeft: 20
            }}
            onClick={()=>{
              this.table.current!.appendRow({
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
              this.table.current.updateRow(0,{
                name: '未知',
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
              this.table.current.reload({})
            }}
          >
            刷新数据
          </Button>
          <Table
            refExt={this.table}
            columns={[{
              dataIndex: 'name',
              isEditing: true,
              title: '人员名称',
              inputWidth: 500,
              inputType: <Input onChange={(e) => {
                if(e.target.value === '0'){
                  self.setState({
                    disable: false
                  })
                }else{
                  self.setState({
                    disable: true
                  })
                }
              } }/>
            }, {
              dataIndex: 'six',
              isEditing: true,
              title: '性别',
            }, {
              dataIndex: 'age',
              isEditing: this.state.disable,
              inputModal: 'display',
              title: '年龄'
            }, {
              dataIndex: 'color',
              inputType: <SketchPicker />,
              title: '年龄'
            }, {
              dataIndex: '$operating',
              title: '操作'
            }]}
            editingType='cell'
            loadData={async ({ page, pageSize }) => {
              const datas: any = []
              for (let i = 0; i < 10; i++) {
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
            onBeforeClickPromiseColumn={async () => {
              self.setState({
                disable: false
              })
              return false
            }}
            rowKey="id"
            onSave={async (record, type: 'DELETE' | 'UPDATE' | 'CREATE') => {
              message.info(`操作类型：${type}, 操作的数据：${JSON.stringify(record)}`)
              return true
            }}
          />
        </>
      )
  }
}

export default CellTable
