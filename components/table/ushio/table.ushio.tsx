import React from 'react'

import { Table, ColumnProps, TableEvent, TableSorter } from '../Table';
import { Button, Checkbox, Select, DatePicker } from 'antd';
import moment from 'moment';

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
                    table.refresh({
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
                rowSelection='multiple'
                refExt={(tempTable: any) => {
                    table = tempTable
                }}
                event={{
                    onSelect: (selectedRowKeys: string[], selected: boolean) => {
                        console.log(selectedRowKeys)
                        console.log(selected)
                    },

                    onRow: (record: User) => {
                        return {
                            onClick: () => {
                                console.log(record)
                            }
                        }
                    },
                    onSave: async (record, type) => {
                        console.log(record)
                        console.log(type)
                        return true
                    }
                } as TableEvent<User>}

                loadData={({ page, pageSize, param }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                    console.log(param)
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
    let tableDom: any = undefined

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
        title: 'six4',
        width: 100
    }/*, {
        dataIndex: '$operating#del',
        title: '操作-删除',
    }*/, {
        dataIndex: '$operating#edit',
        title: '操作-修改',
    }]

    return (
        <>
            <Button
                onClick={() => {
                    const dataSourceState = tableDom.getDataSourceState()
                    console.log(dataSourceState)
                }}
            > click get edit state</Button>
            <Table<User>
                columns={columns}
                refExt={(self: any) => { tableDom = self }}
                rowSelection='multiple'
                editingType="row"
                event={{
                    onSelect: (selectedRowKeys: string[], selected: boolean) => {
                        console.log(selectedRowKeys)
                        console.log(selected)
                    },
                    onRow: (record: User) => {
                        return {
                            onClick: () => {
                                console.log(record)
                            }
                        }
                    },
                    onSave: async (record, type) => {
                        console.log(record)
                        console.log(type)
                        return true
                    },
                    onBeforeRenderPromiseColumn:(record:User , column: ColumnProps<User> ,render: JSX.Element)=>{
                        if(column.dataIndex === '$operating#edit'){
                            if(record.id === '1 id 1'){
                                return <></>
                            }
                        }
                        return render
                    }
                } as TableEvent<User>}
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
        fixed: 'right',
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
                refExt={(self: any) => { tableDom = self }}
                rowSelection='multiple'
                editingType="cell"
                event={{
                    onSelect: (selectedRowKeys: string[], selected: boolean) => {
                        console.log(selectedRowKeys)
                        console.log(selected)
                    },
                    onSave: async (record) => {
                        console.log(record)
                        return true
                    },
                    onBeforeRenderPromiseColumn:(record: UserMoment , column: ColumnProps<UserMoment> ,render: JSX.Element)=>{
                        console.log('--------------onBeforeRenderPromiseColumn------------')
                        return render
                    }
                } as TableEvent<UserMoment>}
                defaultPageSize={10}
                loadData={({ page, pageSize }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) => {
                    return new Promise<{ dataSource: UserMoment[], total: number }>((re) => {
                        let data: UserMoment[] = []
                        for (let i = 0; i < pageSize!; i++) {
                            data.push({
                                'id': `${page} id ${i}`,
                                'name': '0',
                                'six': `${page} six`,
                                'six1': '2018-11-11',
                                'six2': ``,
                                'six3': `${page} six`,
                                'six4': `${page} six`,
                            })
                        }
                        setTimeout(() => {
                            re({ dataSource: data, total: 2000 })
                        }, 3000)

                    })
                }}
            />
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
                    table.refresh({
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
                rowSelection='multiple'
                refExt={(tempTable: any) => {
                    table = tempTable
                }}
                event={{
                    onSelect: (selectedRowKeys: string[], selected: boolean) => {
                        console.log(selectedRowKeys)
                        console.log(selected)
                    },

                    onRow: (record: User) => {
                        return {
                            onClick: () => {
                                console.log(record)
                            }
                        }
                    },
                    
                    onSave: async (record, type) => {
                        console.log(record)
                        console.log(type)
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