import React, { createRef } from 'react'

import { Button, Checkbox, Select, DatePicker } from 'antd';
import moment from 'moment';
import Table, { ColumnProps, TableEvent, TableSorter } from '../components/table/Table';
import { SketchPicker } from '../components/index'

export default { title: 'Table' };


class UserMoment {
    id?: string
    name: string
    six: string
    six1: string
    six2: string
    six3: string
    six4: string
}



type Props = {
    value?: string
    onChange?: (value: string) => void
    onFinish?: () => void
}

class DatePickerExt extends React.Component<Props> {

    private dom?: any


    componentDidMount() {
        this.dom.focus()
    }

    toValue(value?: string) {
        return moment(value, 'YYYY/MM/DD')
    }

    render() {
        const { value } = this.props
        return <DatePicker onBlur={() => { console.log('onBlur') }} ref={(dom) => { this.dom = dom }} value={this.toValue(value)} />
    }
}

class CheckboxExt extends React.Component<Props>{

    toValue(value?: string): boolean {
        return value === '0' ? true : false
    }

    render() {
        const { value, onChange, onFinish } = this.props
        const defaultValue = value === '0' ? [] : ['1']
        return (
            <Checkbox.Group
                value={defaultValue}
                onChange={(values) => {
                    if (values.length === 0) {
                        onChange!('0')
                    } else {
                        onChange!('1')
                    }
                    if (onFinish) {
                        onFinish()
                    }
                }}>
                <Checkbox value="1" />
            </Checkbox.Group>
        )
    }
}


class User {
    id: string
    name: string
    six: string
    six1: string
    six2: string
    six3: string
    six4: string
}

const baseTableRef = createRef<any>()
export const baseTable = () => {
    let columns: ColumnProps<User>[] = [{
        dataIndex: '$index',
        title: '#',
    }, {
        dataIndex: 'name',
        title: 'name',
        isEditing: true,
        width: 100
    }, {
        dataIndex: 'six',
        title: 'six',
        width: 100
    }, {
        dataIndex: 'six1',
        title: 'six1',
        width: 100
    }, {
        dataIndex: 'six2',
        title: 'six2',
        width: 100
    }, {
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    }, {
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    }, {
        dataIndex: '$operating',
        title: '操作',
    }]
    const [rowSelectedKeys, setRowSelectedKeys] = React.useState([])
    return (
        <>
            <Button
                onClick={()=>{
                    setRowSelectedKeys([])
                    console.log(baseTableRef.current!.getSelectRowKeys())
                }}
            >click select
            </Button>
            <Table
                refExt={baseTableRef}
                columns={columns}
                rowSelection="multiple"
                rowSelectedKeys={rowSelectedKeys}
                loadData={({ page, pageSize }: { page: number, pageSize: number, sorter?: TableSorter }) => {
                    return new Promise<{ dataSource: User[], total: number }>((re) => {
                        let data: User[] = []
                        for (let i = 0; i < pageSize!; i++) {
                            data.push({
                                'id': `${page} id ${i}`,
                                'name': `${page} name`,
                                'six': `${page} six`,
                                'six1': `${page} six`,
                                'six2': `${page} six`,
                                'six3': `${page} six`,
                                'six4': `${page} six`,
                            })
                        }
                        re({ dataSource: data, total: 2000 })
                    })
                }}
                event={{
                    onLoadChildren: async ()=>{
                        const data = []
                        for (let i = 0; i < 30; i++) {
                            data.push({
                                'id': `id ${i}`,
                                'name': `name`,
                                'six': `six`,
                                'six1': `six`,
                                'six2': `six`,
                                'six3': `six`,
                                'six4': `six`,
                            })
                        }
                        return data
                    }
                }}
            />
        </>
    )
}

class RowEditorTable extends React.Component {
    private table = createRef<any>()
    render(){
       
        let columns: ColumnProps<User>[] = [{
            dataIndex: '$index',
        }, {
            dataIndex: '$state',
            width: 100
        }, {
            dataIndex: 'name',
            title: 'name',
            align: 'center',
            isEditing: true,
            width: 300
        }, {
            dataIndex: 'six',
            title: 'six',
            isEditing: true,
            width: 100,
            inputType: (
                <CheckboxExt />
            )
        }, {
            dataIndex: 'six1',
            title: 'six1',
            isEditing: true,
            width: 100
        }, {
            dataIndex: 'six2',
            title: 'six2',
            width: 100
        }, {
            dataIndex: 'six3',
            title: 'six3',
            width: 100
        }, {
            dataIndex: 'six4',
            title: 'color',
            isEditing: true,
            inputType: <SketchPicker />,
            width: 100
        }/*, {
            dataIndex: '$operating#del',
            title: '操作-删除',
        }*/, {
            dataIndex: '$operating',
            title: '操作',
        }]
    
        return (
            <>
                <Button
                    onClick={()=>{
                        // table.reload()
                        console.log(this.table.current!.setRowSelectedKeys(['','2']))
                        console.log(this.table.current!.setRowSelectedKeys(['','2']))
                    }}
                >reload</Button>
                <Button
                    onClick={()=>{
                        // table.reload()
                        console.log(this.table.current!)
                    }}
                >reload</Button>
                <Table
                    columns={columns}
                    editingType="row"
                    rowSelection="multiple"
                    refExt={this.table}
                    event={{
                        onSave:  ()=>{
                            return new Promise((re)=>{
                                setTimeout(()=>{
                                    re(true)
                                },3000)
                            })
                        },
                    }}
                    locale={{
                        editText: '编辑',
                        deleteText: '删除'
                    }}
                    loadData={({ page, pageSize }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                        return new Promise<{ dataSource: User[], total: number }>((re) => {
                            let data: User[] = []
                            for (let i = 0; i < pageSize!; i++) {
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': `${page} name`,
                                    'six': `${page} six`,
                                    'six1': `${page} six`,
                                    'six2': `${page} six`,
                                    'six3': `${page} six`,
                                    'six4': `${page} six`,
                                })
                            }
                            re({ dataSource: data, total: 2000 })
                        })
                    }}
                />
            </>
        )
    }
}



let tableDom: any = createRef<any>()
let i = 0
export const cellCheckboxTable = () => {

    let columns: ColumnProps<User>[] = [{
        dataIndex: '$index',
        title: '#',
    }, {
        dataIndex: '$state',
        width: 100
    }, {
        dataIndex: 'name',
        title: 'name',
        width: 100,
        inputModal: 'display',
        isEditing: true,
        inputType: (
            <CheckboxExt />
        )
    }, {
        dataIndex: 'six',
        title: 'six',
        width: 100,
        isEditing: true,
        inputType: (
            <Select style={{ width: '100px' }} defaultValue="Home">
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Company">Company</Select.Option>
            </Select>
        )
    }, {
        dataIndex: 'six1',
        title: 'six1',
        isEditing: true,
        inputType: <DatePickerExt />,
        width: 100
    }, {
        dataIndex: 'six2',
        title: 'six2',
        align: 'right',
        isEditing: true,
        inputType: <DatePickerExt />,

        width: 100
    }, {
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    }, {
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    }, {
        dataIndex: 'six5',
        isEditing: true,
        title: 'six5',
        width: 100
    }, {
        dataIndex: 'six6',
        isEditing: true,
        title: 'six6',
        width: 100
    }, {
        dataIndex: 'six7',
        title: 'six7',
        isEditing: true,
        width: 100
    }]

    return (
        <>
            <Button
                onClick={() => {
                    console.log(tableDom.current.getDataSourceState())
                    console.log(tableDom.current.state)
                }}
            > click get edit state</Button>
            <Button
                onClick={() => {
                    tableDom.editStash()
                }}
            > click edit stash</Button>
            <Button
                onClick={() => {
                    tableDom.current.appendRow({id: i++})
                }}
            > click appendRow</Button>
            <Table
                rowSelection="multiple"
                columns={columns}
                editingType="cell"
                rowSelectedKeyName="name"
                refExt={tableDom}
                loadData={({ page, pageSize }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                    return new Promise<{ dataSource: UserMoment[], total: number }>((re) => {
                        let data: any[] = []
                        for (let i = 0; i < pageSize!; i++) {
                            if(i === 0){
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': '0',
                                    'six': `${page} six`,
                                    'six3': `${page} six3`,
                                    'six4': `${page} six4`,
                                })  
                            }else{
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': '0',
                                    'six': `${page} six`,
                                    'six3': `${page} six--------------sadasdasd---------asdadasdads---------asadas`,
                                    'six4': `${page} six`,
                                })
                            }
                        }
                        re({ dataSource: data, total: 2000 })
                    })
                }}
                event={{
                    onSave: async (data: any , type: 'DELETE' | 'UPDATE' | 'CREATE')=>{
                        console.log(data)
                        console.log(type)
                        return true
                    }
                }}
            />
            <div 
            onClick={()=>{
                console.log('----------')
            }}>点击测试输出</div>
        </>
    )
}


export const zebraCrossingTable = () => {
    let table = createRef<any>()
    let columns: ColumnProps<User>[] = [{
        dataIndex: '$index',
        title: '#',
    }, {
        dataIndex: 'name',
        title: 'name',
        isEditing: true,
        width: 100
    }, {
        dataIndex: 'six',
        title: 'six',
        width: 100
    }, {
        dataIndex: 'six1',
        title: 'six1',
        width: 100
    }, {
        dataIndex: 'six2',
        title: 'six2',
        width: 100
    }, {
        dataIndex: 'six3',
        title: 'six3',
        width: 100
    }, {
        dataIndex: 'six4',
        title: 'six4',
        width: 100
    }, {
        dataIndex: '$operating',
        title: '操作',
    }]

    return (
        <>
            <Button
                onClick={() => {
                    table.current!.reload({
                        a: '1'
                    })
                }}
            >
                click query param
        </Button>
            <Table
                columns={columns}
                editingType="row"
                refExt={table}
                event={{                    
                    onSave: async (record, _type) => {
                        console.log(record)
                        return true
                    },

                    onRenderBodyRowCssStyle: (rowIndex: number)=>{
                        if(rowIndex%2 === 0){
                            return {
                                backgroundColor: '#f9f9f9'
                            }
                        }
                        return {
                            backgroundColor: '#ffffff'
                        }
                    },

                    onRenderHeaderRowCssStyle:() => {
                        return {
                            backgroundColor: '#f2f2f2'
                        }
                    }
                } as TableEvent<User>}

                loadData={({ page, pageSize, param }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                    console.log(param)
                    return new Promise<{ dataSource: User[], total: number }>((re) => {
                        let data: User[] = []
                        for (let i = 0; i < pageSize!; i++) {
                            if(i ===0 ){
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': `我忘记了所有，被忘记了，被摧毁了，不完全被解雇了，据称 ，难忘的。`,
                                    'six': `${page} six`,
                                    'six1': `${page} six`,
                                    'six2': `${page} six`,
                                    'six3': `${page} six`,
                                    'six4': `${page} six`,
                                })
                            }else{
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': `${page} name`,
                                    'six': `${page} six`,
                                    'six1': `${page} six`,
                                    'six2': `${page} six`,
                                    'six3': `${page} six`,
                                    'six4': `${page} six`,
                                })
                            }
                            
                        }
                        re({ dataSource: data, total: 2000 })
                    })
                }}
            />
        </>
    )
}

export const testSelectTable = () => {
    return (
        <>
            <RowEditorTable />
            <RowEditorTable />
        </>
    )
}
