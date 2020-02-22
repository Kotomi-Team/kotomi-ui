import React from 'react'
import { HotKeys } from 'react-hotkeys';
import { Table as AntTable, Form, Divider, Icon, Menu, Dropdown } from 'antd'
import { TableSize, ColumnProps as AntColumnProps, TableRowSelection, TableEventListeners } from 'antd/lib/table/interface'
import { WrappedFormUtils, ValidationRule, FormComponentProps } from 'antd/lib/form/Form';
import XLSX from 'xlsx';
import ReactDOM from 'react-dom';
import { EditableCell } from './EditableCell'

import './style/index'

export type TableContextProps<T> = {
    form?: WrappedFormUtils
    table?: Table<T>,
}

export const TableContext = React.createContext({} as TableContextProps<any>);

export interface ColumnProps<T> extends AntColumnProps<T> {
    // 是否可编辑，默认为false 不可编辑
    isEditing?: boolean
    // 行编辑的单元类型
    inputType?: JSX.Element
    // 校验规则
    rules?: ValidationRule[]
    // 编辑模式，默认为点击编辑，可选为直接显示编辑
    inputModal?: 'click' | 'display',
    // 显示列的别名
    aliasDataIndex?: string
}

/**
 * 默认文案设置
 */
export type TableLocale = {
    editText?: string
    deleteText?: string,
}

interface Props<T> extends FormComponentProps<T> {

    /**
     * 列的信息，以下是一些约定的dataIndex的信息
     *
     * $operating      用来修改数据的默认操作列(包含编辑和删除的列信息)
     * $operating#edit 只显示编辑按钮的列
     * $operating#del  只显示删除的列
     * $state          当前编辑状态
     * $index          序号
     */
    columns: ColumnProps<T>[]

    /**
     * 是否在第一次自动装载数据，默认为true装载
     */
    isAutoLoadData?: boolean

    /**
     * 表格显示大小
     */
    theme?: TableSize

    /**
     * 默认页面显示大小，默认为300条
     */
    defaultPageSize?: number

    /**
     * 用户默认参数
     */
    defaultParam?: any

    /**
     * 默认导出的文件名称
     */
    defaultExportFileName?: string

    /**
     * 表格高度
     */
    height?: boolean | number | string

    /**
     * 表格的宽度
     */
    width?: boolean | number | string

    /**
     * 数据中默认的key,默认字段为id
     */
    rowKey?: string

    /**
     * 是否可以选中行，默认为不显示选择框
     */
    rowSelection?: 'single' | 'multiple' | undefined

    /**
     * 选中的key
     */
    rowSelectedKeys?: string[]

    /**
     *  当前表格的事件
     */
    event?: TableEvent<T>

    // 当前单元格编辑类型，cell表示单元格编辑，row表示行编辑,none 表示无编辑模式
    // 如果为cell编辑模式，则表格不会触发onSave操作
    editingType?: 'cell' | 'row' | 'none'

    // 默认文案设置
    locale?: TableLocale

    // 在第几列上显示展开的信息
    expandIconColumnIndex?: number

    // 当前表格样式
    style?: React.CSSProperties

    // 扩展的表格信息
    refExt?: Function | any

    /**
     * 装载数据的方法
     * @param page 当前第几页信息
     * @param pageSize 当前页面的大小
     * @param param 当前请求数据的参数
     * @param sorter 当前数据查询的参数
     */
    loadData({ page, pageSize, param, sorter }:
        { page: number, pageSize: number, param?: any, sorter?: TableSorter }):
        Promise<{ dataSource: T[], total: number }>,
}

// 数据状态
class DataSourceState<T>{
    update: Array<T> = []
    delete: Array<T> = []
    create: Array<T> = []
}

type State<T> = {
    dataSource: T[]
    total: number
    loading: boolean
    page: number
    pageSize: number
    sorter?: TableSorter
    editingKey?: string,
    disabledCheck: boolean,
    rowSelectedKeys: string[],
}

export type TableSorter = {
    // 字段名称
    name: string
    // 排序方式
    order: string,
}

export type TableEvent<T> = {

    /**
     * 当前表格的选择状态
     * @param selectedRowKeys 当前所有变化的Row的key
     * @param selected        变化状态true表示选中，false表示取消
     */
    onSelect?: (selectedRowKeys: string[], selected: boolean) => boolean | undefined

    /**
     * 当前行的事件
     * @param record 当前行的数据
     * @param index  当前行的索引
     */
    onRow?: (record: T, index: number) => TableEventListeners

    /**
     * 保存数据，对row编辑模式，点击保存即可触发，cell编辑模式下onSave会在点击下一个单元格的时候触发
     * @param record  要操作的数据
     * @param type    当前数据变更的类型，删除更新和创建
     * @returns 如果成功则返回true，否则返回false
     */
    onSave?: (record: T, type: 'DELETE' | 'UPDATE' | 'CREATE') => Promise<boolean>

    /**
     * 在渲染约定的特殊列之前所做的操作
     * @param record 当前列的数据信息
     * @param column 当前的列的信息
     * @param render 当前数据渲染的react的节点数据
     * @returns 返回一个react组件对象
     */
    onBeforeRenderPromiseColumn?: (record: T, column: ColumnProps<T>, render: JSX.Element) => JSX.Element

    /**
     * 表格渲染的行事件
     * @param rowIndex 当前渲染的行号
     * @param record   当前行渲染的数据
     * @returns 返回一个css样式进行装饰
     */
    onRenderBodyRowCssStyle?: (rowIndex: number, record: T) => React.CSSProperties

    /**
     * 头部渲染的事件
     * @param rowIndex 当前渲染的行号
     * @param record   当前行渲染的数据
     * @returns 返回一个css样式进行装饰
     */
    onRenderHeaderRowCssStyle?: () => React.CSSProperties,

    /**
     * 装载子节点数据
     * @param record 当前展开的节点数据
     */
    onLoadChildren?: (record: T) => Promise<T[]>,
}

/**
 *  和后台交互的表格对象，并且可编辑
 */
class Table<T> extends React.Component<Props<T>, State<T>>{
    static defaultProps = {
        theme: 'small',
        defaultPageSize: 50,
        width: '100%',
        height: 400,
        rowKey: 'id',
        // 默认无编辑模式
        editingType: 'row',
        isAutoLoadData: true,
        defaultParam: {},
        defaultExportFileName: `${new Date().getTime()}`,
        rowSelectedKeys: [],
        event: {
            onSelect: () => true,
            onRow: () => { },
            onSave: () => { },
            // 默认返回默认dom节点
            onBeforeRenderPromiseColumn: (_record: any, _column: any, render: JSX.Element) => {
                return render
            },
            // 默认不添加其他的css样式
            onRenderBodyRowCssStyle: () => {
                return {}
            },
            // 默认不添加其他的css样式
            onRenderHeaderRowCssStyle: () => {
                return {}
            },
        },
    }

    static getDerivedStateFromProps<T>(props: Props<T>, prevState: State<T>) {
        if (props.rowSelectedKeys !== prevState.rowSelectedKeys) {
            return {
                rowSelectedKeys: props.rowSelectedKeys,
            }
        }
        return null
    }

    public blankDivElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    state = {
        dataSource: [],
        total: 0,
        loading: false,
        page: 1,
        pageSize: 0,
        sorter: undefined,
        editingKey: undefined,
        disabledCheck: false,
        rowSelectedKeys: [],
    }

    // 用户查询参数
    private REQUEST_PARAM = {}

    // 当前用户的可编辑数据源
    private dataSourceState: DataSourceState<T> = new DataSourceState<T>()

    // 备份的数据源，用于撤销修改
    private backupDataSource: T[] = []

    // 当前正在编辑的cell列
    private currentEditorCell: EditableCell<T>[] = []

    componentDidMount() {
        const { isAutoLoadData } = this.props

        if (isAutoLoadData) {
            this.requestLoadData({
                page: 1,
                pageSize: this.props.defaultPageSize!,
            })
        }
        if (this.props.refExt) {
            if (this.props.refExt instanceof Function) {
                this.props.refExt(this)
            } else {
                const refExt = this.props.refExt as any
                refExt.current = this
            }
        }

    }

    /**
     * 修改暂存，取消当前所有的修改状态
     */
    editStash() {
        const self = this
        this.editHide().then(() => {
        })
        self.dataSourceState.create.splice(0)
        self.dataSourceState.delete.splice(0)
        self.dataSourceState.update.splice(0)
        self.setState({})
    }

    editStatus(): boolean {
        if (this.dataSourceState.create.length > 0) {
            return true
        }
        if (this.dataSourceState.update.length > 0) {
            return true
        }
        if (this.dataSourceState.delete.length > 0) {
            return true
        }
        return false
    }

    restore() {
        this.setState({
            dataSource: JSON.parse(JSON.stringify(this.backupDataSource)),
        })
        this.editStash()
    }

    render() {
        const extProps = {
            expandIconColumnIndex: 0,
        }
        if (this.props.expandIconColumnIndex) {
            extProps.expandIconColumnIndex = this.props.expandIconColumnIndex
        }else {
            delete extProps.expandIconColumnIndex
        }

        return (
            <div>
                <div
                    style={{
                        position: 'fixed',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px',
                        visibility: 'hidden',
                    }}
                    ref={this.blankDivElement}
                    onClick={() => {
                        if (this.blankDivElement.current) {
                            this.blankDivElement.current.style.visibility = 'hidden'
                        }
                        this.editHide()
                    }}
                />
                <Dropdown overlay={this.getDropdownMenu()} trigger={['contextMenu']}>
                    <HotKeys
                        keyMap={{
                            REVOKE: 'ctrl+z',
                        }}
                        handlers={{
                            // 撤销
                            REVOKE: () => {
                                this.restore()
                            },
                        }}
                    >
                        <TableContext.Provider value={{
                            form: this.props.form,
                            table: this,
                        }}>
                            <AntTable
                                style={{
                                    pointerEvents: 'auto',
                                    ...this.props.style,
                                }}
                                childrenColumnName="$children"
                                rowKey={this.props.rowKey}
                                columns={this.getColumns()}
                                rowClassName={() => 'kotomi-components-table-row'}
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                onExpand={(expanded: boolean, record: T) => {
                                    if (expanded && this.props.event!.onLoadChildren) {
                                        this.props.event!.onLoadChildren(record).then((children: T[]) => {
                                            const dataSource = this.state.dataSource
                                            for (let i = 0; i < dataSource.length; i++) {
                                                if (dataSource[i][this.props.rowKey!] === record[this.props.rowKey!]) {
                                                    // @ts-ignore
                                                    const dsChildren: T[] = dataSource[i].$children
                                                    dsChildren.splice(0)
                                                    children.forEach((childrenElement) => {
                                                        // @ts-ignore
                                                        childrenElement.$isChildren = true
                                                        dsChildren.push(childrenElement)
                                                    })
                                                }
                                            }
                                            this.setState({
                                                dataSource,
                                            })
                                        })
                                    }
                                }}
                                dataSource={this.getDataSource()}
                                loading={{
                                    indicator: <Icon
                                        type='loading'
                                        style={{ fontSize: 24 }}
                                        spin
                                    />,
                                    spinning: this.state.loading,
                                }}
                                pagination={{
                                    size: 'small',
                                    pageSize: this.getDefaultPageSize(),
                                    total: this.state.total,
                                }}
                                onChange={(pagination, _filters, sorter) => {
                                    this.requestLoadData({
                                        page: pagination.current!,
                                        pageSize: pagination.pageSize!,
                                        sorter: {
                                            name: sorter.field,
                                            order: sorter.order,
                                        } as TableSorter,
                                    })
                                }}
                                rowSelection={this.getRowSelection()}
                                onHeaderRow={(_columns: ColumnProps<T>[]) => {
                                    let propsStyle = {}
                                    if (this.props.event!.onRenderHeaderRowCssStyle) {
                                        propsStyle = this.props.event!.onRenderHeaderRowCssStyle!()
                                    }
                                    return {
                                        style: propsStyle,
                                    }
                                }}
                                onRow={(record: T, index: number) => {

                                    let propsStyle = {}
                                    if (this.props.event!.onRenderBodyRowCssStyle) {
                                        propsStyle = this.props.event!.onRenderBodyRowCssStyle!(
                                            index as number,
                                            record as T)
                                    }

                                    // 如果当前行处于不可编辑状态，则不点击click事件
                                    if (this.state.editingKey === undefined) {
                                        const onRow = this.props.event!.onRow
                                        const rowData = onRow === undefined ? {} : onRow(record, index)
                                        return {
                                            ...rowData,
                                            style: propsStyle,
                                        }
                                    }
                                    // 否则不相应事件
                                    return {
                                        style: propsStyle,
                                    }
                                }}
                                size='small'
                                scroll={{
                                    x: this.props.width,
                                    y: this.props.height,
                                }}
                                {...extProps}
                            />
                        </TableContext.Provider>
                    </HotKeys>
                </Dropdown>
            </div>
        )
    }

    /**
     * 获取当前表格的编辑状态
     * @returns DataSourceState
     */
    public getDataSourceState() {
        return this.dataSourceState
    }

    /**
     * 用来进行表格的数据刷新，如果参数为空，则是使用上一次的参数进行数据请求
     * @param param 刷新表格的参数
     */
    public reload(param?: any) {
        if (param) {
            this.REQUEST_PARAM = param
        }
        this.requestLoadData({
            page: this.state.page,
            pageSize: this.state.pageSize! || this.props.defaultPageSize!,
            param,
            sorter: this.state.sorter,
        })
    }

    public editHide(): Promise<void[]> {
        const promises: Promise<void>[] = []
        promises.push(new Promise<void>((resolve) => {
            resolve()
        }))
        this.currentEditorCell.forEach(element => {
            promises.push(element.onCellSave('hide'))
        })
        return Promise.all(promises)
    }

    /**
     * 新增一条数据
     * @param 添加的数据
     */
    public appendRow(data: T) {
        const { dataSource } = this.state
        const proxyDataSource: T[] = dataSource
        // @ts-ignore
        data.$state = 'CREATE'
        proxyDataSource.push(data)

        // 添加到对应的数据
        this.dataSourceState.create.push(data)
        this.setState({
            dataSource: proxyDataSource,
        }, () => {
           this.toScrollBottom()
        })
    }

    /**
     * 获取当前选中的key的信息
     */
    public getSelectRowKeys() {
        return this.state.rowSelectedKeys
    }

    protected getDefaultPageSize() {
        return this.props.defaultPageSize! + this.getDataSourceState().create.length
    }

    /**
     * 判断当前行的数据是否可以编辑
     * @param record 当前行的数据
     * @returns true表示可编辑 false表示不可编辑
     */
    protected isEditing(record: T): boolean {
        const { rowKey } = this.props
        const { editingKey } = this.state
        return record[rowKey!] === editingKey
    }

    // 获取当前表格操作的状态
    protected getColumnState(column: ColumnProps<T>) {
        const {
            rowKey,
        } = this.props
        const dataSourceState = this.dataSourceState
        column.render = (_text: string, record: T) => {
            if (
                dataSourceState.update.filter((data) => {
                    return data[rowKey!] === record[rowKey!]
                }).length > 0 ||
                dataSourceState.create.filter((data) => {
                    return data[rowKey!] === record[rowKey!]
                }).length > 0
            ) {
                return (
                    <>
                        <Icon type="edit" />
                    </>
                )
            }
            return (
                <>
                </>
            )
        }
        if (column.width === undefined) {
            column.width = 20
        }
    }

    protected getColumnOperatingRender(editor: JSX.Element, record: any): JSX.Element {
        const self = this
        const {
            event,
            form,
            rowKey,
        } = this.props
        const {
            dataSource,
        } = this.state
        return self.isEditing(record) ? (
            <>
                <Icon
                    type='check'
                    style={this.state.disabledCheck ? { opacity: 0.2 } : {}}
                    onClick={() => {
                        const onSave = event!.onSave
                        if (onSave && form !== undefined) {
                            form.validateFields((err, values) => {

                                if (!err) {
                                    const newRecord: any = {
                                        ...record,
                                    }
                                    Object.keys(values).forEach((key) => {
                                        const recordKey = key.split(';')
                                        newRecord[recordKey[0]] = values[key]
                                    })

                                    // @ts-ignore
                                    const state = newRecord.$state === 'CREATE' ? 'CREATE' : 'UPDATE'

                                    onSave({
                                        ...newRecord,
                                    },
                                    state).then((respState) => {
                                        if (respState === true) {
                                            // 修改表格中的数据
                                            const newData: T[] = [...dataSource];
                                            newData.forEach((data, dataIndex) => {
                                                if (data[rowKey!] === newRecord[rowKey!]) {
                                                    newData.splice(dataIndex, 1, {
                                                        ...newRecord,
                                                    });
                                                }
                                            })
                                            self.setState({
                                                editingKey: undefined,
                                                dataSource: newData,
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }}
                />
                <Divider type='vertical' />
                <Icon
                    type='undo'
                    onClick={() => {
                        this.setState({
                            editingKey: undefined,
                        })
                    }}
                />
            </>
        ) : self.state.editingKey === undefined ? editor : <></>
    }

    protected getColumnOperatingEdit(column: ColumnProps<T>) {
        const {
            event,
        } = this.props
        column.render = (_text: string, record: T) => {
            const editor = (
                <>
                    {this.getColumnEditElement(record)}
                </>
            )

            const columnOperatingRender = this.getColumnOperatingRender(editor, record)
            if (!this.isEditing(record) && this.state.editingKey === undefined) {
                if (event && event.onBeforeRenderPromiseColumn) {
                    return event.onBeforeRenderPromiseColumn(record, column, columnOperatingRender)
                }
            }
            return columnOperatingRender
        }
        if (column.width === undefined) {
            column.width = 80
        }
    }

    protected getColumnOperatingDel(column: ColumnProps<T>) {
        const self = this
        const {
            event,
        } = this.props
        column.render = (_text: string, record: T) => {
            const editor = (
                <>
                    {self.getColumnDelElement(record)}
                </>
            )

            if (!this.isEditing(record) && this.state.editingKey === undefined) {
                if (event && event.onBeforeRenderPromiseColumn) {
                    return event.onBeforeRenderPromiseColumn(record, column, editor)
                }
            }
            return editor
        }
        if (column.width === undefined) {
            column.width = 80
        }
    }

    // 获取操作列的信息
    protected getColumnOperating(column: ColumnProps<T>) {
        const {
            event,
        } = this.props
        column.render = (_text: string, record: T) => {
            const editor = (
                <>
                    {this.getColumnEditElement(record)}
                    <Divider type='vertical' />
                    {this.getColumnDelElement(record)}
                </>
            )

            const operatingRender = this.getColumnOperatingRender(editor, record)
            if (!this.isEditing(record) && this.state.editingKey === undefined) {
                if (event && event.onBeforeRenderPromiseColumn) {
                    return event.onBeforeRenderPromiseColumn(record, column, operatingRender)
                }
            }
            return operatingRender
        }
        if (column.width === undefined) {
            column.width = 80
        }
    }

    protected getColumnDelElement(record: T) {
        const self = this
        const { event } = this.props
        const onClick = () => {
            const onSave = event!.onSave
            if (onSave) {
                onSave(record, 'DELETE').then((respState) => {
                    if (respState !== false) {
                        self.reload()
                    }
                })
            }
        }
        if (this.props.locale && this.props.locale.deleteText) {
            return (
                <a
                    onClick={onClick}
                >
                    {this.props.locale.deleteText}
                </a>
            )
        }
        return (
            <Icon
                type='delete'
                onClick={onClick}
            />
        )
    }

    protected getColumnEditElement(record: T) {
        const { rowKey } = this.props
        const onClick = () => {
            this.setState({
                editingKey: record[rowKey!],
            })
        }
        if (this.props.locale && this.props.locale.editText) {
            return (
                <a
                    onClick={onClick}
                >
                    {this.props.locale.editText}
                </a>
            )
        }
        return (
            <Icon
                type="edit"
                onClick={onClick}
            />
        )
    }

    // 获取index列的信息
    protected getColumnIndex(column: ColumnProps<T>) {
        column.render = (_text: any, record: T, index: number) => {
            // @ts-ignore
            if (record.$isChildren) {
                return <a/>
            }
            return <a>{index + 1}</a>
        }
        if (column.width === undefined) {
            column.width = 25
        }
        if (column.ellipsis === undefined) {
            column.ellipsis = true
        }
        if (column.title === undefined) {
            column.title = '#'
        }
    }
    /**
     * 获得当前列的信息
     */
    protected getColumns(): ColumnProps<T>[] {
        const self = this
        const {
            columns,
            editingType,
            rowKey,
            event,
        } = this.props
        const {
            dataSource,
        } = this.state
        const dataSourceState = this.dataSourceState
        columns.forEach((column) => {
            if (column.dataIndex === '$operating') {
                // 设置操作的表格
                this.getColumnOperating(column)
            } else if (column.dataIndex === '$operating#edit') {
                // 只显示编辑按钮
                this.getColumnOperatingEdit(column)
            } else if (column.dataIndex === '$operating#del') {
                // 只显示删除按钮
                this.getColumnOperatingDel(column)
            } else if (column.dataIndex === '$state') {
                // 设置为状态的列
                this.getColumnState(column)
            } else if (column.dataIndex === '$index') {
                // 获取index列的信息
                this.getColumnIndex(column)
            } else {
                if (column.ellipsis === undefined) {
                    column.ellipsis = true
                }

                if (column.sortDirections === undefined
                    &&
                    column.sorter === true
                ) {
                    // 默认显示升序，和倒序排序
                    column.sortDirections = ['descend', 'ascend']
                }

                // 如果有别名，那么显示别名信息
                if (column.aliasDataIndex) {
                    const key: string = column.aliasDataIndex!
                    column.render = (_text: any, record: T, _index: number) => {
                        return <span>{record[key]}</span>
                    }
                }
                // 如果属性设置为可编辑，则渲染可编辑的表格，默认为不可编辑
                column.onCell = (record: T, rowIndex: number) => {
                    return {
                        column,
                        record,
                        rowIndex,
                        editing: this.isEditing(record),
                        isEditing: column.isEditing,
                        editingType: editingType,
                        inputModal: column.inputModal,
                        currentEditorCell: this.currentEditorCell,
                        onSave: async (values: T) => {

                            // 修改表格中的数据
                            const newData: T[] = [...dataSource];
                            newData.forEach((data, dataIndex) => {
                                if (data[rowKey!] === values[rowKey!]) {
                                    newData.splice(dataIndex, 1, {
                                        ...values,
                                    });

                                }
                            })
                            // @ts-ignore
                            const state = values.$state === 'CREATE' ? 'CREATE' : 'UPDATE'
                            if (state === 'UPDATE') {
                                if (dataSourceState.update.filter((data) => data[rowKey!] === values[rowKey!]).length > 0) {
                                    // 如果这个属性存在于更新状态中，则修改更新状态中的数据
                                    const { update } = dataSourceState
                                    for (let i = 0; i < update.length; i += 1) {
                                        const element = update[i]
                                        if (element[rowKey!] === values[rowKey!]) {
                                            // 如果已经改变过状态，设置状态为可改变状态
                                            if (JSON.stringify(element) !== JSON.stringify(values)) {
                                                dataSourceState.update.splice(i, 1, {
                                                    ...values,
                                                })
                                            }
                                            break
                                        }
                                    }
                                } else {
                                    // 如果不存在与update中，则添加一个标识信息
                                    dataSourceState.update.push(values)
                                }
                            }

                            if (state === 'CREATE') {
                                if (dataSourceState.create.filter((data) => data[rowKey!] === values[rowKey!]).length > 0) {
                                    // 如果这个属性存在于更新状态中，则修改更新状态中的数据
                                    const { create } = dataSourceState
                                    for (let i = 0; i < create.length; i += 1) {
                                        const element = create[i]
                                        if (element[rowKey!] === values[rowKey!]) {
                                            // 如果已经改变过状态，设置状态为可改变状态
                                            if (JSON.stringify(element) !== JSON.stringify(values)) {
                                                dataSourceState.create.splice(i, 1, {
                                                    ...values,
                                                })
                                            }
                                            break
                                        }
                                    }
                                }
                            }

                            self.setState({ dataSource: newData });
                            const onSave = event!.onSave
                            if (onSave) {
                                const respState = await onSave(values, state)
                                if (respState === undefined) {
                                    return true
                                }
                                return respState
                            }
                            return true
                        },
                    }
                }
                // 给一个宽度的默认值
                if (column.width === undefined) {
                    column.width = 120
                }
            }

        })
        return this.props.columns
    }

    /**
     * 获取当前表格数据的数据源
     */
    protected getDataSource(): T[] {
        return this.state.dataSource
    }

    /**
     * 滚动到最底部
     */
    protected toScrollBottom() {
        // eslint-disable-next-line react/no-find-dom-node
        const element = ReactDOM.findDOMNode(this) as Element
        const bodyElement = element.getElementsByClassName('ant-table-body')[0]!
        bodyElement.scrollTop = bodyElement.scrollHeight;
    }

    /**
     * 向后台请求数据
     * @param page     当前页面
     * @param pageSize 当前页面显示的数据条数
     */
    protected requestLoadData({ page, pageSize, param, sorter }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) {
        const { defaultParam, rowKey } = this.props
        this.setState({
            loading: true,
        })

        // 如果请求失败，则不做任何操作
        this.props.loadData({
            page,
            pageSize,
            param: {
                ...param,
                ...defaultParam,
                ...this.REQUEST_PARAM,
            }, sorter,
        }).then(({ dataSource, total }) => {

            // fix https://github.com/Kotomi-Team/kotomi-ui/issues/13
            dataSource.forEach((data) => {
                const keys = Object.keys(data)

                if (this.props.event!.onLoadChildren) {

                    // @ts-ignore
                    data.$children = []
                }

                if (keys.indexOf(rowKey!) === -1) {
                    throw new Error(
                        `KOTOMI-TABLE-5001: The returned data should have a unique rowKey field. rowKey is ['${rowKey}']. See https://github.com/Kotomi-Team/kotomi-ui/issues/13`,
                    )
                }
            })

            this.setState({
                dataSource,
                total,
                loading: false,
                editingKey: undefined,
            })
            this.backupDataSource = JSON.parse(JSON.stringify(dataSource))
            this.editStash()
        })
    }

    protected getRowSelection(): TableRowSelection<T> | undefined {
        const self = this
        const rowProps: TableRowSelection<T> = {
            type: 'checkbox',
            columnWidth: 16,
            selectedRowKeys: this.state.rowSelectedKeys,
            onSelect: (record: T, selected: boolean) => {
                let respState: boolean | undefined = true
                if (self.props.event!.onSelect) {
                    respState = self.props.event!.onSelect(record[self.props.rowKey!], selected)
                }
                if (respState) {
                    const id = record[self.props.rowKey!] as string
                    if (selected) {
                        const rowSelectedKeys: string[] = self.state.rowSelectedKeys
                        rowSelectedKeys.push(id)
                        self.setState({
                            rowSelectedKeys,
                        })
                    }else {
                        const rowSelectedKeys: string[] = self.state.rowSelectedKeys
                        rowSelectedKeys.splice(rowSelectedKeys.indexOf(id), 1)

                        self.setState({
                            rowSelectedKeys,
                        })
                    }
                }
            },
            onSelectAll: (selected: boolean, selectedRows: T[], changeRows: T[]) => {
                let respState: boolean | undefined = true
                if (self.props.event!.onSelect) {
                    respState = self.props.event!.onSelect(changeRows.map((record) => record[self.props.rowKey!]), selected)
                }
                if (respState) {
                    const selectKeys = selectedRows.map<string>((record) => record[self.props.rowKey!] as string)
                    self.setState({
                        rowSelectedKeys: selectKeys,
                    })
                }
            },
        }
        switch (this.props.rowSelection) {
            case 'single':
                rowProps.type = 'radio'
                return rowProps
            case 'multiple':
                rowProps.type = 'checkbox'
                return rowProps
            default:
                return undefined
        }
    }

    // 导出文件
    protected exportData(type: 'xls') {
        const { dataSource } = this.state;
        const filename = `${this.props.defaultExportFileName}.${type}`
        const book = XLSX.utils.book_new()
        const bookSheet = XLSX.utils.json_to_sheet([...dataSource]);
        XLSX.utils.book_append_sheet(book, bookSheet, this.props.defaultExportFileName);
        XLSX.writeFile(book, filename);
    }

    // 获取右键点击
    protected getDropdownMenu() {
        return (
            <Menu>
                <Menu.Item
                    key="xls"
                    onClick={() => { this.exportData('xls') }}
                >
                    <Icon type="file-excel" />
                    Export xls
                </Menu.Item>
            </Menu>
        )
    }
}

const EditableFormTable = Form.create<Props<any>>({})(Table as React.ComponentType<any>);

export { EditableFormTable as Table };
