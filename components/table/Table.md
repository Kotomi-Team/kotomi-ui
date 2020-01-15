## Table 表格


### Table 属性

|名称        | 类型                | 默认值  | 描述
|----       |----                |-----   |------
|columns     |ColumnProps        |       | 数据的列的信息
|loadData    |({ page, pageSize, param, sorter }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }): Promise<{ dataSource: T[], total: number }>| 无 |请求后台返回的分页数据
|theme      |TableSize           |'small' | 表格的显示样式，有以下取值 'default' | 'middle' | 'small'
|defaultPageSize |number         |300     | 默认当前表格显示的数据大小，默认为显示300条数据
|defaultParam    |any            |{}      | 请求数据的默认带参数，设置此参数，会在每次请求的时候都会带上此参数信息，建议在第一次加载数据的时候进行设置，不要通过setState来进行控制
|height          |boolean `|` number `|` string  | 400 | 表格的高度，默认为400px
|width           |boolean `|` number `|` string  | `'100%'` | 表格的宽度，默认为百分之百
|rowKey          |string         | `id`       | 当前表格默认的rowKey，默认为id字段，可手动设置为其他字段
|rowSelection   | 'single' `|` 'multiple' `|` undefined `|` undefined | 表格的选择模式，默认为undefined不显示选择框
|editingType    | 'cell' `|` 'row' `|` 'none' | 'none' | 当前单元格编辑类型，cell表示单元格编辑，row表示行编辑,none 表示无编辑模式
|style          | React.CSSProperties |  | 表格的css样式
|refExt         | (self: Table<T>) => void |  | 初始化表格数据的时候，可通过self获取当前表格对象
|event          |  TableEvent<T>   |    |  当前表格的事件信息

### Table 事件

|名称        | 类型                                                    | 默认值  | 描述
|----       |----                                                     |-----   |------
|onSelect   |(selectedRowKeys: string[], selected: boolean) => void   |        | 用户点击选择框选中，或者取消的时候触发的事件
|onRow      |(record: T, index: number) => TableEventListeners        |        |用户点击当前行触发的事件。
|onSave     | (record: T, type: 'DELETE' | 'UPDATE' | 'CREATE') => Promise<boolean>| | 用户编辑保存会触发他的onSave事件。


> 保存数据，只针对row编辑模式，cell编辑模式下onSave会在点击下一个单元格的时候触发




### Column 属性

|名称        | 类型                | 默认值  | 描述
|----       |----                |-----   |------
|isEditing  |boolean             | false  | 是否可编辑，默认为false，不可编辑状态，true为可编辑
|inputType  |JSX.Element         | Input  | 当前Form的Item元素，默认为antd 的[Input](https://ant.design/components/input-cn/)组件
|rules      |ValidationRule      | []     | 当前表格列的校验规则，可参照antd的[校验规则](https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99)
|inputModal |'click' `|` 'display' | 'click' | 当前表格的编辑模式，display表示一直显示在表格上，click表示点击后才能进行编辑
|aliasDataIndex |string            | `undefined` |当前表格的显示字段， dataIndex表示实际的值，aliasDataIndex表示这列的显示值，实际调用onSave保存还是操作的dataIndex字段的数据

> 以上是对于Ant Design表格的扩展属性，其他常规属性参照 [https://ant.design/components/table-cn/#Column](https://ant.design/components/table-cn/#Column) 的表格的参数。

#### Column.dataIndex 约定特殊字符

在Column的dataIndex中约定了一下的特殊字符具有特殊的含义

|名称              | 描述
|----             |------
|$operating       | 操作的列，提供了编辑和删除图标的功能列
|$operating#edit  | 只提供编辑的功能列
|$operating#del   | 只提供删除的功能列
|$state           | 显示当前表格的编辑状态
|$index           | 显示当前表格的序号

### 简单例子

#### 一个行编辑模式的表格，并且可以控制编辑的列

通过`isEditing`属性来控制是否可以编辑，默认为不可编辑。


```tsx
export const rowEditorTable = () => {
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
        isEditing: true,
        width: 100
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
```

### 一个单元格编辑的表格，也可以控制编辑的列，以及单元格编辑组件的显示方式

```tsx
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
        title: 'six3',
        width: 100
    }, {
        dataIndex: 'six4',
        title: 'six4',
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
                    }
                } as TableEvent<UserMoment>}
                defaultPageSize="10"
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
```