import React from 'react'

import { Table,ColumnProps,TableEvent,TableSorter } from '../Table';
import { Button, Checkbox, Select } from 'antd';

export default { title: 'Table' };

class User  {
    id: string 
    name: string 
    six: string
    six1: string
    six2: string
    six3: string
    six4: string
}

export const baseTable = () => {
    let columns: ColumnProps<User>[] = [{
        dataIndex: '$state'
    },{
        dataIndex: 'name',
        title: 'name',
        width: 100
    },{
        dataIndex: 'six',
        title: 'six',
        width: 100
    },{
        dataIndex: 'six1',
        title: 'six1',
        width: 100
    },{
        dataIndex: 'six2',
        title: 'six2',
        width: 100
    },{
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    },{
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    },{
        dataIndex: '$operating',
        title: '操作',
    }]

    return (
        <Table<User>
            columns={columns}
            rowSelection = 'multiple'
            event={{
               onSelect:(selectedRowKeys:string[],selected: boolean)=>{
                    console.log(selectedRowKeys)
                    console.log(selected)
                },

                onRow:(record:User)=>{
                    return {
                        onClick:()=>{
                            console.log(record)
                        }
                    }
                },
                onSave: async (record,type) => {
                    console.log(record)
                    console.log(type)
                    return true
                }
            } as TableEvent<User>}
            loadData={({page, pageSize}:{page:number,pageSize:number,param?:any,sorter?:TableSorter})=>{
                return new Promise<{dataSource:User[],total:number}>((re)=>{
                    let data:User[] = []
                    for(let i = 0; i<pageSize! ;i++){
                        data.push({
                            'id':`${page} id ${i}`,
                            'name':`${page} name`,
                            'six':`${page} six`,
                            'six1':`${page} six`,
                            'six2':`${page} six`,
                            'six3':`${page} six`,
                            'six4':`${page} six`,
                        })
                    }
                    re({dataSource: data, total: 2000})
                })
            }}
        />
    )
}

export const cellEditorTable = () => {
    let tableDom : any = undefined 

    let columns: ColumnProps<User>[] = [{
        dataIndex: '$state',
        width: 100
    },{
        dataIndex: 'name',
        title: 'name',
        width: 100
    },{
        dataIndex: 'six',
        title: 'six',
        width: 100
    },{
        dataIndex: 'six1',
        title: 'six1',
        width: 100
    },{
        dataIndex: 'six2',
        title: 'six2',
        width: 100
    },{
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    },{
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    }]

    return (
        <>
            <Button
                onClick={()=>{
                    const dataSourceState = tableDom.getDataSourceState()
                    console.log(dataSourceState)
                }}
            > click get edit state</Button>
            <Table<User>
                columns={columns}
                refExt={(self: any)=>{ tableDom = self}}
                rowSelection = 'multiple'
                isEditing={true}
                event={{
                    onSelect:(selectedRowKeys:string[],selected: boolean)=>{
                            console.log(selectedRowKeys)
                            console.log(selected)
                        },
                    onRow:(record:User)=>{
                        return {
                            onClick:()=>{
                                console.log(record)
                            }
                        }
                    },
                    onSave: async (record,type) => {
                        console.log(record)
                        console.log(type)
                        return true
                    }
                } as TableEvent<User>}
                loadData={({page, pageSize}:{page:number,pageSize:number,param?:any,sorter?:TableSorter})=>{
                    return new Promise<{dataSource:User[],total:number}>((re)=>{
                        let data:User[] = []
                        for(let i = 0; i<pageSize! ;i++){
                            data.push({
                                'id':`${page} id ${i}`,
                                'name':`${page} name`,
                                'six':`${page} six`,
                                'six1':`${page} six`,
                                'six2':`${page} six`,
                                'six3':`${page} six`,
                                'six4':`${page} six`,
                            })
                        }
                        re({dataSource: data, total: 2000})
                    })
                }}
            />
        </>
    )
}


export const cellCheckboxTable = () => {
    let tableDom : any = undefined 

    let columns: ColumnProps<User>[] = [{
        dataIndex: '$state',
        width: 100
    },{
        dataIndex: 'name',
        title: 'name',
        width: 100,
        inputType: (
            <Checkbox value="A">A</Checkbox>
        )
    },{
        dataIndex: 'six',
        title: 'six',
        width: 100,
        inputType: (
          <Select style={{ width: '100px' }} defaultValue="Home">
            <Select.Option value="Home">Home</Select.Option>
            <Select.Option value="Company">Company</Select.Option>
          </Select>
        )
    },{
        dataIndex: 'six1',
        title: 'six1',
        width: 100
    },{
        dataIndex: 'six2',
        title: 'six2',
        width: 100
    },{
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    },{
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    }]

    return (
        <>
            <Button
                onClick={()=>{
                    const dataSourceState = tableDom.getDataSourceState()
                    console.log(dataSourceState)
                }}
            > click get edit state</Button>
            <Table<User>
                columns={columns}
                refExt={(self: any)=>{ tableDom = self}}
                rowSelection = 'multiple'
                isEditing={true}
                event={{
                onSelect:(selectedRowKeys:string[],selected: boolean)=>{
                        console.log(selectedRowKeys)
                        console.log(selected)
                    },
                    onRow:(record:User)=>{
                        return {
                            onClick:()=>{
                                console.log(record)
                            }
                        }
                    },
                    onSave: async (record,type) => {
                        console.log(record)
                        console.log(type)
                        return true
                    }
                } as TableEvent<User>}
                loadData={({page, pageSize}:{page:number,pageSize:number,param?:any,sorter?:TableSorter})=>{
                    return new Promise<{dataSource:User[],total:number}>((re)=>{
                        let data:User[] = []
                        for(let i = 0; i<pageSize! ;i++){
                            data.push({
                                'id':`${page} id ${i}`,
                                'name':`${page} name`,
                                'six':`${page} six`,
                                'six1':`${page} six`,
                                'six2':`${page} six`,
                                'six3':`${page} six`,
                                'six4':`${page} six`,
                            })
                        }
                        re({dataSource: data, total: 2000})
                    })
                }}
            />
        </>
    )
}
