/**
 * title: 大数据的表格
 * desc: 非常大的数据表格，里面一次性显示了2万条数据
 */
import React from 'react'
import { Table } from '@rwp/react-ui'
import { Menu, DatePicker } from 'asp-antd-compatible'
import moment from 'moment';

const EditorDatePicker = (props: any) => {
  return (
    <DatePicker
      showTime
      style={props.style}
      placeholder="选择日期"
      value={moment(props.value || 0)}
      onChange={(e: any) => {
        props.onChange(e.valueOf())
      }}
    />
  )
}

const getColumns = () => {
  const columns = []
  for(let i=0; i< 1000 ; i ++){
    columns.push({
      name: `field${i}`,
      title: `字段-${i}`,
      width: 120,
      editable: true,
      sortable: true,
      editor: EditorDatePicker
    })
  }
  return columns
}

const BigDataTable = () => {
    const table = React.useRef<any>()
    return (
        <>
          <Table
            rowKey="field0"
            columns={getColumns()}
            contextMenu={()=>{
              return (
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={()=>{
                        console.log(table.current.rightContext())
                    }}>
                        打印右键的上下文信息
                    </Menu.Item>
                </Menu>
              )
            }}
            table={table}
            
            loadData={(pageNo) => {  
              return new Promise<{ total: number; datas: any[]; }>((resolve) =>{
                const datas: any[] = []
                for(let i=0; i< 50 ; i++){
                  const data = {}
                  for(let z=0; z< 1000 ; z ++){
                    data[`field${z}`] = `${pageNo}-field${i}-${i}`;
                  }
                  datas.push(data)
                }
                setTimeout(() => {
                  resolve({
                      datas,
                      total: 100
                    })
                }, 1000);
              })
            }}
          /> 
        </>
    )
}


export default BigDataTable