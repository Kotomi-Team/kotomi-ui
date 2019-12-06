import React from 'react'
import { Table,ColumnProps,TableEvent } from '../table';

export default { title: 'Table' };

class User  {
    id: string 
    name: string 
    six: string
}

export const baseTable = () => {
    let columns: ColumnProps<User>[] = [{
        dataIndex: 'id',
        title: 'id'
    },{
        dataIndex: 'name',
        title: 'name'
    },{
        dataIndex: 'six',
        title: 'six'
    }]

    return (
        <Table<User>
            columns={columns}
            rowSelection = "multiple"
            event={{
               /* onSelect:(selectedRowKeys:string[],selected: boolean)=>{
                    console.log(selectedRowKeys)
                    console.log(selected)
                },*/
            } as TableEvent<User>}
            loadData={({page, pageSize,param,sorter})=>{
                return new Promise<{dataSource:User[],total:number}>((re)=>{
                    let data:User[] = []
                    for(let i = 0; i<pageSize! ;i++){
                        data.push({
                            'id':`${page} id ${i}`,
                            'name':`${page} name`,
                            'six':`${page} six`
                        })
                    }
                    setTimeout(()=>{
                        re({dataSource: data, total: 2000})
                    },500)
                })
            }}
        />
    )
}
