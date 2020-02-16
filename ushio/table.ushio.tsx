import React from 'react'

import { Button, Checkbox, Select, DatePicker } from 'antd';
import moment from 'moment';
import { Table, ColumnProps, TableEvent, TableSorter } from '../components/table/Table';
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

    return (
        <>
            <Table<User>
                columns={columns}
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
            />
        </>
    )
}

export const rowEditorTable = () => {
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
            <Table<User>
                columns={columns}
                // editingType="row"
                event={{
                    onSave: async ()=>{
                        return true
                    }
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




export const cellCheckboxTable = () => {
    let tableDom: any = undefined

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
        isEditing: true,
        title: 'six3',
        width: 100
    }, {
        dataIndex: 'six4',
        isEditing: true,
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
                    const dataSourceState = tableDom.getDataSourceState()
                    console.log(dataSourceState)
                }}
            > click get edit state</Button>
            <Button
                onClick={() => {
                    tableDom.editStash()
                }}
            > click edit stash</Button>
            <Table<UserMoment>
                columns={columns}
                editingType="cell"
                loadData={({ page, pageSize }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                    return new Promise<{ dataSource: UserMoment[], total: number }>((re) => {
                        let data: UserMoment[] = []
                        for (let i = 0; i < pageSize!; i++) {
                            if(i === 0){
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': '0',
                                    'six': `${page} six`,
                                    'six1': '2018-11-11',
                                    'six2': `1231`,
                                    'six3': `${page} six3`,
                                    'six4': `${page} six4`,
                                })  
                            }else{
                                data.push({
                                    'id': `${page} id ${i}`,
                                    'name': '0',
                                    'six': `${page} six`,
                                    'six1': '2018-11-11',
                                    'six2': `1231`,
                                    'six3': `${page} six--------------sadasdasd---------asdadasdads---------asadas`,
                                    'six4': `${page} six`,
                                })
                            }
                        }
                        re({ dataSource: data, total: 2000 })
                    })
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
    let table: any = null
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
                    table.reload({
                        a: '1'
                    })
                }}
            >
                click query param
        </Button>
            <Table<User>
                columns={columns}
                isEditing
                editingType="row"
                refExt={(tempTable: any) => {
                    table = tempTable
                }}
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