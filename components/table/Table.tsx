import React from 'react'
import ReactDOM from 'react-dom';
import { Table as AntTable, Divider, Icon, Menu, Dropdown, Pagination, Form } from 'antd'
import { TableSize, ColumnProps as AntColumnProps, TableRowSelection, TableEventListeners } from 'antd/lib/table/interface'
import { WrappedFormUtils, ValidationRule, FormComponentProps } from 'antd/lib/form/Form';
import XLSX from 'xlsx';
import lodash from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import DragRow from './DragRow'
import { EditableCell } from './EditableCell'

import './style/index.less'

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
     * 当前key绑定的名称
     */
    rowSelectedKeyName?: string

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
     * 当前表格的选择状态
     * @param changeRowsKeys  当前所有变化的Row的key
     * @param changeRows      当前选中的行数据
     * @param selected        变化状态true表示选中，false表示取消
     */
    onSelect?: (changeRowsKeys: string[], changeRows: T[], selected: boolean) => boolean | undefined

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
     * 在调用特殊约定的列的时候触发的click事件
     * @param record 当前列的数据信息
     * @param column 当前的列的信息
     * @returns 返回一个true/false对象，true表示执行默认逻辑，false表示不执行默认逻辑
     */
    onBeforeClickPromiseColumn?: (type: 'EDIT' | 'DELETE' | 'SAVE' | 'CANCEL' , record: T) => Promise<boolean>

    /**
     * 表格渲染的行事件
     * @param rowIndex 当前渲染的行号
     * @param record   当前行渲染的数据
     * @returns 返回一个css样式进行装饰
     */
    onRenderBodyRowCssStyle?: (rowIndex: number, record: T) => React.CSSProperties

    /**
     * 表格渲染选择框
     */
    onRenderCheckboxProps?: (record: T) => Object
    /**
     * 头部渲染的事件
     * @param rowIndex 当前渲染的行号
     * @param record   当前行渲染的数据
     * @returns 返回一个css样式进行装饰
     */
    onRenderHeaderRowCssStyle?: () => React.CSSProperties

    /**
     * 拖动表格行触发的事件
     * @param  源数据
     * @param  目标数据
     */
    onDragRow?: (source: T, targe: T) => Promise<boolean>

    /**
     * 渲染下拉框的时候触发的事件
     */
    onRenderDropdownMenu?: (render: JSX.Element) => JSX.Element

    /**
     * 装载子节点数据
     * @param record 当前展开的节点数据
     */
    onLoadChildren?: (record: T) => Promise<T[]>,

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
        onSelect: () => true,
        onRow: () => { },
        onSave:  async () => true,
        onBeforeClickPromiseColumn: async () => true ,
        onBeforeRenderPromiseColumn: (_record: any, _column: any, render: JSX.Element) => render,
        onRenderBodyRowCssStyle: () => {
            return {}
        },
        onRenderHeaderRowCssStyle: () => {
            return {}
        },
        onRenderDropdownMenu: (render: JSX.Element) => {
            return (
                <Menu>
                    {render}
                </Menu>
            )
        },
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

    private table: React.RefObject<AntTable<T>> = React.createRef<AntTable<T>>()

    // 用户查询参数
    private REQUEST_PARAM = {}

    // 当前用户的可编辑数据源
    private dataSourceState: DataSourceState<T> = new DataSourceState<T>()

    // 备份的数据源，用于撤销修改
    private backupDataSource: T[] = []

    // 当前正在编辑的cell列
    private currentEditorCell: EditableCell<T>[] = []

    constructor(props: Props<T>) {
        super(props)
        this.state.rowSelectedKeys = (props.rowSelectedKeys || []) as never[]
    }

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
            dataSource: [...this.backupDataSource],
        })
        this.editStash()
    }

    render() {
        const extProps = {
            expandIconColumnIndex: 0,
        }
        if (this.props.expandIconColumnIndex) {
            extProps.expandIconColumnIndex = this.props.expandIconColumnIndex
        } else {
            delete extProps.expandIconColumnIndex
        }
        const components: any = {
            body: {
                cell: EditableCell,
            },
        }

        // 如果有onDragRow事件，则表示可拖拽
        if (this.props.onDragRow) {
            components.body.row = DragRow
        }

        return (
            <TableContext.Provider value={{
                form: this.props.form,
                table: this,
            }}>
                <DndProvider backend={Backend}>
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
                        <div>
                            <AntTable
                                style={{
                                    ...this.props.style,
                                }}
                                ref={this.table}
                                childrenColumnName="$children"
                                rowKey={this.props.rowKey}
                                columns={this.getColumns()}
                                rowClassName={() => 'kotomi-components-table-row'}
                                components={components}
                                onExpand={(expanded: boolean, record: T) => {
                                    const { rowKey } = this.props
                                    if (expanded && this.props.onLoadChildren) {
                                        this.props.onLoadChildren(record).then((children: T[]) => {
                                            const dataSource = this.state.dataSource
                                            const loops = (loopsDataSource: any[]): any[] => loopsDataSource.map((element: any) => {
                                                 // @ts-ignore
                                                const chil = element.$children
                                                if (element[rowKey!] === record[rowKey!]) {
                                                    return {
                                                        ...element,
                                                        '$children': children,
                                                    };
                                                }
                                                if (chil === undefined) {
                                                    return element
                                                }
                                                // @ts-ignore
                                                return {
                                                    ...element,
                                                    '$children': loops(chil),
                                                };
                                            })
                                            this.setState({
                                                dataSource: loops(dataSource),
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
                                pagination={false}
                                rowSelection={this.getRowSelection()}
                                onHeaderRow={(_columns: ColumnProps<T>[]) => {
                                    let propsStyle = {}
                                    if (this.props.onRenderHeaderRowCssStyle) {
                                        propsStyle = this.props.onRenderHeaderRowCssStyle!()
                                    }
                                    return {
                                        style: propsStyle,
                                    }
                                }}
                                onRow={(record: T, index: number) => {
                                    let propsStyle = {}
                                    if (this.props.onRenderBodyRowCssStyle) {
                                        propsStyle = this.props.onRenderBodyRowCssStyle!(
                                            index as number,
                                            record as T)
                                    }
                                    // 如果当前行处于不可编辑状态，则不点击click事件
                                    if (this.state.editingKey === undefined) {
                                        const onRow = this.props.onRow
                                        const rowData = onRow === undefined ? {} : onRow(record, index)
                                        return {
                                            ...rowData,
                                            style: propsStyle,
                                            record,
                                            index,
                                            table: this,
                                        }
                                    }
                                    // 否则不相应事件
                                    return {
                                        style: propsStyle,
                                        record,
                                        index,
                                        table: this,
                                    }
                                }}
                                size='small'
                                scroll={{
                                    x: this.props.width,
                                    y: this.props.height,
                                }}
                                {...extProps}
                            />
                        </div>
                    </Dropdown>
                    <Pagination
                        className="kotomi-components-table-pagination"
                        size='small'
                        current={this.state.page}
                        total={this.state.total}
                        pageSize={this.props.defaultPageSize!}
                        onChange={(page: number, pageSize?: number) => {
                            this.requestLoadData({
                                page,
                                pageSize: pageSize!,
                                sorter: {} as TableSorter,
                            })
                        }}
                    />
                </DndProvider>
            </TableContext.Provider>
        )
    }

    public exchangeRow(source: T, targe: T) {
        const updateData = this.recursiveDataSource(this.state.dataSource, (element) => {
            if (element[this.props.rowKey!] === source[this.props.rowKey!]) {
                return {
                    ...targe,
                }
            }

            if (element[this.props.rowKey!] === targe[this.props.rowKey!]) {
                return {
                    ...source,
                }
            }
            return element
        })
        this.setState({
            dataSource: updateData,
        })
    }

    /**
     * 获取当前表格的编辑状态
     * @returns DataSourceState
     */
    public getDataSourceState() {
        return this.dataSourceState
    }

    /**
     * 设置选中的key
     * @param rowSelectedKeys 表格选中的key
     */
    public setRowSelectedKeys(rowSelectedKeys: string[]) {
        this.setState({
            rowSelectedKeys,
        })
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
     * 获取当前选择的数据
     */
    public getSelectRowKeys() {
        return this.state.rowSelectedKeys
    }

    /**
     * 新增一条数据
     * @param 添加的数据
     */
    public appendRow(data: T, displayEditor = true) {
        const { dataSource } = this.state
        // @ts-ignore
        data.$state = 'CREATE'
        if (
            // 判断添加的id不能为空
            data[this.props.rowKey!] === undefined
        ) {
            throw new Error(`KOTOMI-TABLE-5002: The added rowKey must cannot be unique. rowKey [${this.props.rowKey}] , data  [${JSON.stringify(data)}]`)
        }
        if (
            // 判断添加的数据id不能重复
            dataSource.filter(element => element[this.props.rowKey!] === data[this.props.rowKey!]).length > 0
        ) {
            throw new Error(`KOTOMI-TABLE-5002: The added rowKey must cannot be duplicate. rowKey [${this.props.rowKey}] , data  [${JSON.stringify(data)}]`)
        }
        const proxyDataSource: T[] = [...dataSource]
        proxyDataSource.push(data)

        // 添加到对应的数据
        this.dataSourceState.create.push(data)

        this.setState({
            dataSource: proxyDataSource,
            pageSize: this.props.defaultPageSize! + this.dataSourceState.create.length,
        }, () => {
            this.toScrollBottom()
            if (displayEditor) {
                this.setState({
                    editingKey: data[this.props.rowKey!],
                })
            }
        })
    }

    protected recursiveDataSource(dataSource: any[], callbackfn: (data: any) => any) {
        const respData: any[] = []
        for (let i = 0; i < dataSource.length; i++) {
            // @ts-ignore
            if (dataSource[i].$children && dataSource[i].$children.length > 0) {
                respData.push(callbackfn({
                    ...dataSource[i],
                    '$children': this.recursiveDataSource(dataSource[i].$children, callbackfn),
                }))
            } else {
                respData.push(callbackfn(dataSource[i]))
            }
        }
        return respData
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
            form,
            rowKey,
            onSave,
            onBeforeClickPromiseColumn,
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
                        const saveData = () => {
                            if (onSave && form !== undefined) {
                                form.validateFields((err, values) => {

                                    if (!err) {
                                        const newRecord: any = {
                                            ...record,
                                        }
                                        Object.keys(values).forEach((key) => {
                                            const recordKey = key.split(';')
                                            const recordKeyNumber = Number.parseInt(recordKey[1], 10)
                                            if (recordKey[1]) {
                                                if (self.getEditorRowIndex() === recordKeyNumber) {
                                                    newRecord[recordKey[0]] = values[key]
                                                }
                                            }
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
                                                            newData[dataIndex] = { ...newRecord }
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
                        }
                        if (onBeforeClickPromiseColumn) {
                            form.validateFields((_err, values) => {
                                onBeforeClickPromiseColumn('SAVE', values).then((respData) => {
                                    if (respData) {
                                        saveData()
                                    }
                                })
                            })
                        }else {
                            saveData()
                        }

                    }}
                />
                <Divider type='vertical' />
                <Icon
                    type='undo'
                    onClick={() => {
                        const cancelData = () => {
                            const dataIndex = this.getEditorRowIndex()
                            if (dataIndex !== undefined && this.props.editingType === 'row') {
                                const fields: string[] = []
                                this.props.columns.forEach((column) => {
                                    if (column.inputModal === 'display') {
                                        const fieldName = column.dataIndex as string + ';' + dataIndex
                                        const oldData = this.state.dataSource[dataIndex][column.dataIndex as string]
                                        const newData = this.props.form.getFieldValue(fieldName)
                                        if (oldData !== newData) {
                                            fields.push(fieldName)
                                        }
                                    }
                                })
                                if (fields.length > 0) {
                                    this.props.form.resetFields(fields)
                                }
                            }
                            this.setState({
                                editingKey: undefined,
                            })
                        }
                        if (onBeforeClickPromiseColumn) {
                            form.validateFields((_err, values) => {
                                onBeforeClickPromiseColumn('CANCEL', values).then((respData) => {
                                    if (respData) {
                                        cancelData()
                                    }
                                })
                            })
                        }else {
                            cancelData()
                        }
                    }}
                />
            </>
        ) : self.state.editingKey === undefined ? editor : <></>
    }

    protected getEditorRowIndex() {
        for (let i = 0; i < this.state.dataSource.length; i++) {
            if (this.state.dataSource[i][this.props.rowKey!] === this.state.editingKey) {
                return i;
            }
        }
        return undefined
    }
    protected getColumnOperatingEdit(column: ColumnProps<T>) {
        const {
            onBeforeRenderPromiseColumn,
        } = this.props
        column.render = (_text: string, record: T) => {
            const editor = (
                <>
                    {this.getColumnEditElement(record)}
                </>
            )

            const columnOperatingRender = this.getColumnOperatingRender(editor, record)
            if (!this.isEditing(record) && this.state.editingKey === undefined) {
                if (onBeforeRenderPromiseColumn) {
                    return onBeforeRenderPromiseColumn(record, column, columnOperatingRender)
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
            onBeforeRenderPromiseColumn,
        } = this.props
        column.render = (_text: string, record: T) => {
            const editor = (
                <>
                    {self.getColumnDelElement(record)}
                </>
            )

            if (!this.isEditing(record) && this.state.editingKey === undefined) {
                if (onBeforeRenderPromiseColumn) {
                    return onBeforeRenderPromiseColumn(record, column, editor)
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
            onBeforeRenderPromiseColumn,
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
                if (onBeforeRenderPromiseColumn) {
                    return onBeforeRenderPromiseColumn(record, column, operatingRender)
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
        const { onSave, onBeforeClickPromiseColumn } = this.props
        const deleteData = () => {
            if (onSave) {
                onSave(record, 'DELETE').then((respState) => {
                    if (respState !== false) {
                        self.reload()
                    }
                })
            }
        }
        const onClick = () => {
            if (onBeforeClickPromiseColumn) {
                onBeforeClickPromiseColumn('DELETE', record).then((respData) => {
                    if (respData) {
                        deleteData()
                    }
                })
            }else {
                deleteData()
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
        const { rowKey, onBeforeClickPromiseColumn } = this.props
        const editData = () => {
            this.setState({
                editingKey: record[rowKey!],
            })
        }
        const onClick = () => {
            if (onBeforeClickPromiseColumn) {
                onBeforeClickPromiseColumn('EDIT', record).then((respData) => {
                    if (respData) {
                        editData()
                    }
                })
            }else {
                editData()
            }
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
            if (record.$Children) {
                return <a>{index + 1}</a>
            }
            return <a />
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
            onSave,
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
                        onSave: lodash.debounce(async (values: T) => {

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
                                this.updateDataSource(values)
                            }

                            if (state === 'CREATE') {
                                if (dataSourceState.create.filter((data) => data[rowKey!] === values[rowKey!]).length > 0) {
                                    // 如果这个属性存在于更新状态中，则修改更新状态中的数据
                                    const { create } = dataSourceState
                                    for (let i = 0; i < create.length; i += 1) {
                                        const element = create[i]
                                        if (element[rowKey!] === values[rowKey!]) {
                                            // 如果已经改变过状态，设置状态为可改变状态
                                            if (!lodash.isEqual(element, values)) {
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
                            if (onSave) {
                                const respState = await onSave(values, state)
                                if (respState === undefined) {
                                    return true
                                }
                                return respState
                            }
                            return true
                        }, 60),
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

    protected updateDataSource(values: T) {
        const {
            rowKey,
        } = this.props
        const dataSourceState = this.dataSourceState
        if (dataSourceState.update.filter((data) => data[rowKey!] === values[rowKey!]).length > 0) {
            // 如果这个属性存在于更新状态中，则修改更新状态中的数据
            const { update } = dataSourceState
            for (let i = 0; i < update.length; i += 1) {
                const element = update[i]
                if (element[rowKey!] === values[rowKey!]) {
                    // 如果已经改变过状态，设置状态为可改变状态
                    if (!lodash.isEqual(element, values)) {
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
        const element = ReactDOM.findDOMNode(this.table.current!) as Element
        const bodyElement = element.getElementsByClassName('ant-table-body')[0]!
        if (bodyElement) {
            bodyElement.scrollTop = bodyElement.scrollHeight;
        }
    }

    /**
     * 向后台请求数据
     * @param page     当前页面
     * @param pageSize 当前页面显示的数据条数
     */
    protected requestLoadData({ page, pageSize, param, sorter }: { page: number, pageSize: number, param?: any, sorter?: TableSorter }) {
        const { defaultParam, rowKey, defaultPageSize } = this.props

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

                if (this.props.onLoadChildren) {

                    // @ts-ignore
                    data.$children = []
                }

                if (keys.indexOf(rowKey!) === -1) {
                    throw new Error(
                        `KOTOMI-TABLE-5001: The returned data should have a unique rowKey field. rowKey is ['${rowKey}']. See https://github.com/Kotomi-Team/kotomi-ui/issues/13`,
                    )
                }
            })

            const rowSelectedKeys = new Array<string>()
            if (this.props.rowSelectedKeyName) {
                dataSource.forEach((element) => {
                    if (element[this.props.rowSelectedKeyName!] === true) {
                        rowSelectedKeys.push(element[this.props.rowKey!] as never)
                    }
                })

            }
            this.dataSourceState.create.splice(0)

            this.setState({
                dataSource,
                total,
                loading: false,
                editingKey: undefined,
                page,
                pageSize: defaultPageSize!,
                rowSelectedKeys,
            })
            this.backupDataSource = [...dataSource]
            this.editStash()
        })
    }

    protected onSelect(changeRowsKeys: string[], changeRows: T[], selected: boolean) {
        const { dataSource } = this.state
        const id = this.props.rowKey!
        const self = this
        changeRows.forEach((element) => {

            const data = dataSource.filter(record => record[id] === element[id])
            data.forEach((record) => {
                // @ts-ignore
                record[this.props.rowSelectedKeyName] = selected
                self.updateDataSource(record as T)
            })
        })
        if (this.props.onSelect) {
            return this.props.onSelect(changeRowsKeys, changeRows, selected)
        }
        return true
    }

    protected getRowSelection(): TableRowSelection<T> | undefined {
        const self = this
        const rowProps: TableRowSelection<T> = {
            type: 'checkbox',
            columnWidth: 28,
            selections: true,
            getCheckboxProps: (record: T) => {
                let checked = false
                if (self.state.rowSelectedKeys.indexOf(record[self.props.rowKey!] as never) !== -1) {
                    checked = true
                } else {
                    checked = false
                }
                let checkBoxProps = {}
                if (self.props.onRenderCheckboxProps) {
                    checkBoxProps = self.props.onRenderCheckboxProps(record)
                }
                return {
                    ...checkBoxProps,
                    checked,
                }
            },
            onSelect: (record: T, selected: boolean) => {
                let respState: boolean | undefined = true
                respState = self.onSelect([record[self.props.rowKey!] as string], [record], selected)
                if (respState) {
                    const id = record[self.props.rowKey!] as string
                    if (selected) {
                        const rowSelectedKeys: string[] = [...self.state.rowSelectedKeys] || []
                        self.setState({
                            rowSelectedKeys: [...rowSelectedKeys, id],
                        })
                    } else {
                        const rowSelectedKeys: string[] = [...self.state.rowSelectedKeys] || []
                        rowSelectedKeys.splice(rowSelectedKeys.indexOf(id), 1)
                        self.setState({
                            rowSelectedKeys,
                        })
                    }
                }
            },

            onSelectAll: (selected: boolean, selectedRows: T[], changeRows: T[]) => {
                let respState: boolean | undefined = true
                respState = self.onSelect(changeRows.map(record => record[self.props.rowKey!] as string), changeRows, selected)
                if (respState) {
                    const selectKeys = selectedRows.map<string>((record) => record[self.props.rowKey!] as string)
                    self.setState({
                        rowSelectedKeys: selectKeys,
                    })
                }
            },
            onSelectInvert: (selectedRowKeys: string[]) => {
                let respState: boolean | undefined = true
                const selectedRows = self.state.dataSource.filter(record => selectedRowKeys.indexOf(record[self.props.rowKey!]) !== -1)
                respState = self.onSelect(selectedRowKeys, selectedRows, true)
                if (respState) {
                    self.setState({
                        rowSelectedKeys: selectedRowKeys,
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
        const dropdownMenu = (
            <Menu.Item
                key="xls"
                onClick={() => { this.exportData('xls') }}
            >
                <Icon type="file-excel" />
                Export xls
            </Menu.Item>
        )
        return this.props.onRenderDropdownMenu!(dropdownMenu)
    }
}

export default Form.create<Props<any>>()(Table as React.ComponentType<any>);
