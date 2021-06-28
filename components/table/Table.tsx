import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom';
import { Table as AntTable, Divider, Icon, Menu, Pagination, Form } from 'asp-antd-compatible'
import { TableSize, ColumnProps as AntColumnProps, TableRowSelection, TableEventListeners, PaginationConfig, SorterResult, TableCurrentDataSource } from 'asp-antd-compatible/lib/table/interface'
import { WrappedFormUtils, ValidationRule, FormComponentProps } from 'asp-antd-compatible/lib/form/Form';
import { HeightProperty } from 'csstype'
import XLSX from 'xlsx';
import lodash from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
// @ts-ignore
import { VirtualTable } from 'ant-virtual-table'

import DragRow from './DragRow'
import { EditableCell } from './EditableCell'

import './style/index.less'

export type TableContextProps<T> = {
    form?: WrappedFormUtils
    table?: Table<T>,
    dropdownMenu?: any,
}

// const FilterDropdown = (props: any) => {
//     const [checkedKeys, setCheckedKeys] = useState<string[]>(props.checkedKeys)
//     return (
//         <Tree
//             checkable
//             checkedKeys={checkedKeys}
//             onCheck={(keys) => {
//                 setCheckedKeys(keys as string[])
//                 if (props.onCheck) {
//                     props.onCheck(keys)
//                 }
//             }}
//         >
//             {props.columns.map((tempCol: any) => <Tree.TreeNode title={tempCol.title} selectable={false} key={`${tempCol.dataIndex}`} />)}
//         </Tree>
//     )
// }

export const TableContext = React.createContext({} as TableContextProps<any>);

export interface ColumnProps<T> extends AntColumnProps<T> {
    // 是否可编辑，默认为false 不可编辑
    isEditing?: boolean | Function
    // 行编辑的单元类型
    inputType?: JSX.Element | Function
    // 校验规则
    rules?: ValidationRule[]
    // 编辑模式，默认为点击编辑，可选为直接显示编辑
    inputModal?: 'click' | 'display',
    // 显示列的别名
    aliasDataIndex?: string
    // 输入框的宽度
    inputWidth?: number
    children?: ColumnProps<T>[];
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

    bordered?: boolean

    /**
     * 是否在第一次自动装载数据，默认为true装载
     */
    isAutoLoadData?: boolean

    /**
     * 表格显示大小
     */
    theme?: TableSize

    /**
     * 是否是虚拟表格
     */
    virtual?: boolean

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
    height?: HeightProperty<string | 0>
    /**
     * 表格的宽度
     */
    width?: HeightProperty<string | 0>

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

    // 指定每页可以显示多少条
    pageSizeOptions?: string[]

    onChange?: (pagination: PaginationConfig, filters: Partial<Record<keyof T, string[]>>, sorter: SorterResult<T>, extra: TableCurrentDataSource<T>) => void;

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
    onBeforeRenderPromiseColumn?: (
        record: T,
        column: ColumnProps<T>,
        render: JSX.Element) => JSX.Element

    /**
     * 在调用特殊约定的列的时候触发的click事件
     * @param record 当前列的数据信息
     * @param column 当前的列的信息
     * @returns 返回一个true/false对象，true表示执行默认逻辑，false表示不执行默认逻辑
     */
    onBeforeClickPromiseColumn?: (type: 'EDIT' | 'DELETE' | 'SAVE' | 'CANCEL', record: T) => Promise<boolean>

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
    onRenderDropdownMenu?: () => JSX.Element

    /**
     * 装载子节点数据
     * @param record 当前展开的节点数据
     */
    onLoadChildren?: (record: T) => Promise<T[]>,

    /**
     * 拦截渲染的Tooltip
     */
    onRenderTooltip?: (tooltip: JSX.Element, props: any, td: ReactNode) => JSX.Element,

    expandedRowKeys?: string []

    expandedRowRender?: (
        record: T,
        index: number,
        indent: number,
        expanded: boolean) => React.ReactNode;

    onExpand?: (expanded: boolean, record: T) => void

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
class DataSourceState<T> {
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
    columns?: ColumnProps<T>[],
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
class Table<T> extends React.Component<Props<T>, State<T>> {

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
        bordered: false,
        virtual: false,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        inputModal: 'click',
        onSelect: () => true,
        onRow: () => { },
        onSave: async () => true,
        onBeforeClickPromiseColumn: async () => true,
        onBeforeRenderPromiseColumn: (_record: any, _column: any, render: JSX.Element) => render,
        onRenderBodyRowCssStyle: () => ({}),
        onRenderHeaderRowCssStyle: () => ({}),
        onRenderDropdownMenu: () => (

                <Menu/>
            ),
        onRenderTooltip: (render: JSX.Element) => render,
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
        columns: [],
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

    // private columnCheck: string[] = []

    constructor(props: Props<T>) {
        super(props)
        this.state.rowSelectedKeys = (props.rowSelectedKeys || []) as never[]
        this.state.columns = (props.columns || []) as never[]
        // this.columnCheck = props.columns.map((element) => element.dataIndex!)
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

    componentDidUpdate() {
        // eslint-disable-next-line react/no-find-dom-node
        const tablElement = ReactDOM.findDOMNode(this.table.current) as Element
        const antTableBody = tablElement.getElementsByClassName('asp-table-body')[0]
        if (antTableBody) {
            const style = antTableBody.getAttribute('style')
            antTableBody.setAttribute('style', style!.replace(/min-height:.*;/g, ''))
            if (this.state.dataSource.length > 0) {
                // 固定Table的高度
                const { height } = this.props

                if (lodash.isNumber(height)) {
                    antTableBody.setAttribute('style', `${style}; min-height:${height}px;`)
                } else {
                    antTableBody.setAttribute('style', `${style}; min-height:${height};`)
                }
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
        // 清空当前编辑的数据
        this.currentEditorCell.splice(0)
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

    /**
     *
     * 修改当前行的数据
     *
     * @param id     当前行的唯一ID
     * @param value  要修改的数据
     */
    public updateRow(id: string, value: any) {
        const { form, rowKey } = this.props
        const self = this
        const dataSource = this.getDataSource()
        dataSource.forEach((data, dataIndex) => {
            // @ts-ignore
            if (data[rowKey!] === id) {
                dataSource.splice(dataIndex, 1, {
                    ...data,
                    ...value,
                });

                const fields = {}
                Object.keys(value).forEach(key => {
                    // @ts-ignore
                    fields[`${key};${dataIndex}`] = value[key]
                })
                form.setFieldsValue(fields)
            }
        })

        self.setState({
            dataSource,
        })
    }

    public exchangeRow(source: T, targe: T) {
        const updateData = this.recursiveDataSource(this.state.dataSource, element => {
            // @ts-ignore
            if (element[this.props.rowKey!] === source[this.props.rowKey!]) {
                return {
                    ...targe,
                }
            }

            // @ts-ignore
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
        const table = this.table.current!
        table.store.setState({
            selectedRowKeys: rowSelectedKeys,
        })
    }

    /**
     * 用来进行表格的数据刷新，如果参数为空，则是使用上一次的参数进行数据请求
     * @param param 刷新表格的参数
     * @param isCurrentPage 是否在当前页，进行重新装载数据
     */
    public reload(param?: any, isCurrentPage: boolean = false) {
        if (param) {
            this.REQUEST_PARAM = param
        }
        this.requestLoadData({
            page: isCurrentPage ? this.state.page : 1,
            pageSize: this.state.pageSize! || this.props.defaultPageSize!,
            param,
            sorter: this.state.sorter,
        })
    }

    public editHide(): Promise<void[]> {
        const promises: Promise<void>[] = []
        promises.push(new Promise<void>(resolve => {
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

    public delRow(id: any | any[]) {
        const { dataSource } = this.state
        const { rowKey } = this.props
        const proxyDataSource: T[] = []
        dataSource.forEach(element => {
            if (lodash.isArray(id)) {
                if (id.indexOf(element[rowKey!]) === -1) {
                    proxyDataSource.push(element)
                }
            } else if (element[rowKey!] !== id) {
                    proxyDataSource.push(element)
                }
        })
        this.setState({
            dataSource: proxyDataSource,
        })
    }

    /**
     * 新增一条数据
     * @param 添加的数据
     */
    public appendRow(data: T | T[], displayEditor = true) {
        const { dataSource } = this.state
        // @ts-ignore
        data.$state = 'CREATE'
        const proxyDataSource: T[] = [...dataSource]

        if (lodash.isArray(data)) {
            (data as T[]).forEach(element => {
                this.verifyAppendRowKey(element);
            })
            proxyDataSource.push(...(data as T[]))
            this.dataSourceState.create.push(...(data as T[]))
        } else {
            this.verifyAppendRowKey(data as T)
            proxyDataSource.push(data as T)
            this.dataSourceState.create.push(data as T)
        }
        this.setState({
            dataSource: proxyDataSource,
            pageSize: this.props.defaultPageSize! + this.dataSourceState.create.length,
        }, () => {
            this.toScrollBottom()
            if (displayEditor) {
                this.setState({
                    // @ts-ignore
                    editingKey: data[this.props.rowKey!],
                })
            }
        })
    }

    // 导出文件
    public exportData(type: 'xls') {
        const { dataSource, rowSelectedKeys } = this.state;
        const { rowKey } = this.props
        const filename = `${this.props.defaultExportFileName}.${type}`
        const book = XLSX.utils.book_new()
        let bookSheet;
        if (rowSelectedKeys.length > 0) {
            bookSheet = XLSX.utils.json_to_sheet(dataSource.filter(element => rowSelectedKeys.indexOf(element[rowKey!]) !== -1));
        } else {
            bookSheet = XLSX.utils.json_to_sheet([...dataSource]);
        }
        XLSX.utils.book_append_sheet(book, bookSheet, this.props.defaultExportFileName);
        XLSX.writeFile(book, filename);
    }

    /**
     * 获取当前表格数据的数据源
     */
    public getDataSource(): T[] {
        return lodash.cloneDeep(this.state.dataSource)
    }

    render() {
        const extProps = {
            expandIconColumnIndex: 0,
            expandedRowKeys: this.props.expandedRowKeys,
        }
        if (this.props.expandIconColumnIndex) {
            extProps.expandIconColumnIndex = this.props.expandIconColumnIndex
        } else {
            delete extProps.expandIconColumnIndex
        }
        if (!this.props.expandedRowKeys) {
            delete extProps.expandedRowKeys
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
        const TempTable = this.props.virtual ? VirtualTable : AntTable
        return (
            <TableContext.Provider value={{
                form: this.props.form,
                table: this,
                dropdownMenu: this.getDropdownMenu(),
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
                    <TempTable
                        style={{
                            ...this.props.style,
                        }}
                        ref={this.table}
                        bordered={this.props.bordered}
                        expandedRowRender={this.props.expandedRowRender}
                        childrenColumnName="$children"
                        rowKey={this.props.rowKey}
                        columns={this.getColumns()}
                        rowClassName={() => 'kotomi-components-table-row'}
                        components={components}
                        onChange={this.props.onChange}
                        onExpand={(expanded: boolean, record: T) => {
                            const { rowKey, onExpand } = this.props
                            if (expanded && this.props.onLoadChildren) {
                                this.props.onLoadChildren(record).then((children: T[]) => {
                                    const { dataSource } = this.state
                                    const loops = (loopsDataSource: any[]): any[] => loopsDataSource.map((element: any) => {
                                        // @ts-ignore
                                        const chil = element.$children
                                        // @ts-ignore
                                        if (element[rowKey!] === record[rowKey!]) {
                                            return {
                                                ...element,
                                                $children: children,
                                            };
                                        }
                                        if (chil === undefined) {
                                            return element
                                        }
                                        // @ts-ignore
                                        return {
                                            ...element,
                                            $children: loops(chil),
                                        };
                                    })
                                    this.setState({
                                        dataSource: loops(dataSource),
                                    })
                                })
                            }

                            if (onExpand) {
                                onExpand(expanded, record)
                            }
                        }}
                        dataSource={this.getDataSource()}
                        loading={{
                            indicator: <Icon
                                type="loading"
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
                                const { onRow } = this.props
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
                        size="small"
                        scroll={{
                            x: this.props.width,
                            y: this.props.height,
                        }}
                        {...extProps}
                    />
                    <Pagination
                        className="kotomi-components-table-pagination"
                        size="small"
                        current={this.state.page}
                        total={this.state.total}
                        hideOnSinglePage
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={this.props.pageSizeOptions}
                        defaultPageSize={this.props.defaultPageSize!}
                        onShowSizeChange={(page: number, pageSize?: number) => {
                            this.requestLoadData({
                                page,
                                pageSize: pageSize!,
                                sorter: {} as TableSorter,
                            })
                        }}
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

    /**
     * 验证ID数据是否正确
     */
    protected verifyAppendRowKey(data: any) {
        const { dataSource } = this.state
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
    }

    protected recursiveDataSource(dataSource: any[], callbackfn: (data: any) => any) {
        const respData: any[] = []
        for (let i = 0; i < dataSource.length; i++) {
            // @ts-ignore
            if (dataSource[i].$children && dataSource[i].$children.length > 0) {
                respData.push(callbackfn({
                    ...dataSource[i],
                    $children: this.recursiveDataSource(dataSource[i].$children, callbackfn),
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
        // @ts-ignore
        return record[rowKey!] === editingKey
    }

    // 获取当前表格操作的状态
    protected getColumnState(column: ColumnProps<T>) {
        const {
            rowKey,
        } = this.props
        const { dataSourceState } = this
        column.render = (_text: string, record: T) => {
            if (
                dataSourceState.update.filter(data =>
                    // @ts-ignore
                     data[rowKey!] === record[rowKey!],
                ).length > 0 ||
                dataSourceState.create.filter(data =>
                    // @ts-ignore
                     data[rowKey!] === record[rowKey!],
                ).length > 0
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
                    type="check"
                    style={this.state.disabledCheck ? { opacity: 0.2 } : {}}
                    onClick={() => {
                        const saveData = () => {
                            if (onSave && form !== undefined) {
                                form.validateFields((err, values) => {
                                    if (!err) {
                                        const newRecord: any = {
                                            ...record,
                                        }
                                        Object.keys(values).forEach(key => {
                                            const recordKey = key.split(';')
                                            const recordKeyNumber = Number.parseInt(recordKey[1], 10)
                                            if (recordKey[1]) {
                                                if (self.getEditorRowIndex() === recordKeyNumber) {
                                                    // @ts-ignore
                                                    newRecord[recordKey[0]] = values[key]
                                                }
                                            }
                                        })
                                        // @ts-ignore
                                        const state = newRecord.$state === 'CREATE' ? 'CREATE' : 'UPDATE'

                                        onSave({
                                            ...newRecord,
                                        },
                                            state).then(respState => {
                                                if (respState === true) {
                                                    // 修改表格中的数据
                                                    const newData: T[] = [...dataSource];
                                                    newData.forEach((data, dataIndex) => {
                                                        // @ts-ignore
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
                                onBeforeClickPromiseColumn('SAVE', values).then(respData => {
                                    if (respData) {
                                        saveData()
                                    }
                                })
                            })
                        } else {
                            saveData()
                        }
                    }}
                />
                <Divider type="vertical" />
                <Icon
                    type="undo"
                    onClick={() => {
                        const cancelData = () => {
                            const dataIndex = this.getEditorRowIndex()
                            if (dataIndex !== undefined && this.props.editingType === 'row') {
                                const fields: string[] = []
                                this.props.columns.forEach(column => {
                                    if (column.inputModal === 'display') {
                                        const fieldName = `${column.dataIndex as string};${dataIndex}`
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
                                onBeforeClickPromiseColumn('CANCEL', values).then(respData => {
                                    if (respData) {
                                        cancelData()
                                    }
                                })
                            })
                        } else {
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
                    <Divider type="vertical" />
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
                onSave(record, 'DELETE').then(respState => {
                    if (respState !== false) {
                        // @ts-ignore
                        const data = self.state.rowSelectedKeys.filter(element => element !== record[self.props.rowKey!])
                        self.setState({
                            rowSelectedKeys: data,
                        })
                        self.reload(null, true)
                    }
                })
            }
        }
        const onClick = () => {
            if (onBeforeClickPromiseColumn) {
                onBeforeClickPromiseColumn('DELETE', record).then(respData => {
                    if (respData) {
                        deleteData()
                    }
                })
            } else {
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
                type="delete"
                onClick={onClick}
            />
        )
    }

    protected getColumnEditElement(record: T) {
        const { rowKey, onBeforeClickPromiseColumn } = this.props
        const editData = () => {
            this.setState({

                // @ts-ignore
                editingKey: record[rowKey!],
            })
        }
        const onClick = () => {
            if (onBeforeClickPromiseColumn) {
                onBeforeClickPromiseColumn('EDIT', record).then(respData => {
                    if (respData) {
                        editData()
                    }
                })
            } else {
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
        column.render = (_text: any, _record: T, index: number) =>
            // @ts-ignore
            /* if (record.$Children) {
                return <a>{index + 1}</a>
            } */
             <span style={{ textAlign: column.align }}>{index + 1}</span>

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
            editingType,
            rowKey,
            onSave,
            onRenderTooltip,
            columns,
        } = this.props
        const {
            dataSource,
        } = this.state
        const { dataSourceState } = this
        columns.forEach((column: ColumnProps<T>) => {
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
                    column.render = (_text: any, record: T, _index: number) => <span>{record[key]}</span>
                }
                const onCell = (record: T, rowIndex: number) => ({
                        column,
                        record,
                        rowIndex,
                        editing: this.isEditing(record),
                        isEditing: lodash.isFunction(column.isEditing) ? column.isEditing(record) : column.isEditing,
                        editingType,
                        inputModal: column.inputModal,
                        currentEditorCell: this.currentEditorCell,
                        onRenderTooltip,
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
                                this.updateDataSource(values)
                            }

                            if (state === 'CREATE') {
                                if (dataSourceState.create.filter(data => data[rowKey!] === values[rowKey!]).length > 0) {
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
                        },
                    })
                const loops = (tempColumn: ColumnProps<T>[]): any => tempColumn.map((element: ColumnProps<T>) => {
                        if (element.children) {
                            return loops(element.children)
                        }
                        return {
                            ...element,
                            onCell,
                        }
                    })

                // 如果属性设置为可编辑，则渲染可编辑的表格，默认为不可编辑
                column.onCell = onCell
                if (column.children) {
                    column.children = loops(column.children)
                }
                // 给一个宽度的默认值
                if (column.width === undefined) {
                    column.width = 120
                }
            }
        })
        return columns
    }

    protected updateDataSource(values: T) {
        const {
            rowKey,
        } = this.props
        const { dataSourceState } = this
        if (dataSourceState.update.filter(data => data[rowKey!] === values[rowKey!]).length > 0) {
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
            },
sorter,
        }).then(({ dataSource, total }) => {
            // fix https://github.com/Kotomi-Team/kotomi-ui/issues/13
            dataSource.forEach(data => {
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

            const rowSelectedKeys = this.state.rowSelectedKeys || []

            if (this.props.rowSelectedKeyName) {
                dataSource.forEach(element => {
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
                pageSize,
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
        changeRows.forEach(element => {
            const data = dataSource.filter(record => record[id] === element[id])
            data.forEach(record => {
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
            columnWidth: 35,
            // 暂时不显示下拉框。
            selections: false,
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
                        if (this.props.rowSelection === 'single') {
                            self.setState({
                                rowSelectedKeys: [id],
                            })
                        } else {
                            self.setState({
                                rowSelectedKeys: [...rowSelectedKeys, id],
                            })
                        }
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
                    const selectKeys = selectedRows.map<string>(record => record[self.props.rowKey!] as string)
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

    // 获取右键点击
    protected getDropdownMenu() {
        return this.props.onRenderDropdownMenu!()
    }
}

export default Form.create<Props<any>>()(Table as React.ComponentType<any>);
