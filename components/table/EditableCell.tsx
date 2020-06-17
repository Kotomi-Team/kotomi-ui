import React from 'react'
import lodash from 'lodash'
import ReactDom from 'react-dom'
import { Form, Input, Tooltip, Dropdown } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, TableContext, TableContextProps } from './Table'
import './style/index.less'

type Props<T> = {
    // 列的信息
    column: ColumnProps<T>
    // 当前行的数据
    record: T
    // 当前行号
    rowIndex?: number
    // 当前单元格是否可编辑 true表示可编辑，false表示不可编辑
    editing?: boolean
    // 当前单元格编辑类型，cell表示单元格编辑，row表示行编辑
    editingType?: 'cell' | 'row'
    // 用户触发保存的信息
    onSave: (record: T, type: 'DELETE' | 'UPDATE' | 'CREATE') => Promise<boolean>
    // 渲染onRenderTooltip
    onRenderTooltip: Function
    // 显示模式，点击编辑，或者直接显示
    inputModal?: 'click' | 'display'
    // 当前正在编辑的cell
    currentEditorCell: EditableCell<T>[]
    isEditing: boolean
    className: string,
}

type State = {
    editing: boolean
    ellipsis: boolean,
}

// 计算如果含有子节点的顺序
let calculationColumn: number = 0;
let calculationKey: string | undefined = undefined;

export class EditableCell<T> extends React.Component<Props<T>, State>{

    static defaultProps = {
        editing: false,
        // 单元格编辑模式，默认为
        editingType: 'cell',
        // 默认为点击编辑模式，这个模式只在行编辑模式下生效
        inputModal: 'click',
    }

    state = {
        editing: false,
        ellipsis: false,
    }

    private form: WrappedFormUtils

    componentDidMount() {
        this.setState({
            editing: this.props.editing!,
            ellipsis: this.getEllipsisState(),
        })

    }

    getEllipsisState(): boolean {
        try {
            // eslint-disable-next-line react/no-find-dom-node
            const element: Element = ReactDom.findDOMNode(this)! as Element
            if (element.clientWidth < element.scrollWidth) {
                if (this.props.column !== undefined) {
                    return true
                }
            }
            return false
        } catch (error) {
            return false
        }
    }

    getColumnInfo() {
        const { column } = this.props
        if (calculationKey !== column.dataIndex) {
            calculationColumn = 0;
        }
        calculationKey = column.dataIndex
        if (column.children) {
            const realColumn = column.children[calculationColumn]
            calculationColumn += 1
            return realColumn;
        }

        return column
    }

    /**
     * 调用onSave的方法
     * @param isHideComponent hide 表示隐藏表格上的输入组件，none 表示不做任何操作
     */
    onCellSave(isHideComponent: 'hide' | 'none'): Promise<void> {
        return new Promise((resolve, _reject) => {
            const self = this
            const { onSave, record, rowIndex } = this.props
            this.form.validateFields((err, values: any) => {
                if (!err) {
                    const newRecord: any = {
                        ...record,
                    }
                    Object.keys(values).forEach((key) => {
                        const recordKey = key.split(';')

                        // 修复一列多个输入组件导致的BUG
                        if (Number.parseInt(recordKey[1], 10) === rowIndex) {
                            newRecord[recordKey[0]] = values[key]
                        }
                    })
                    if (!lodash.isEqual(record, newRecord)) {
                        onSave({
                            ...newRecord,
                        }, 'UPDATE').then((_respState) => {
                            resolve()
                        })
                    }

                    // 如果隐藏组件，则隐藏
                    if (isHideComponent === 'hide') {
                        self.setState({
                            editing: false,
                            ellipsis: this.getEllipsisState(),
                        })
                    }
                }
            })

        })
    }

    renderFormItem = (form: WrappedFormUtils) => {
        const { record, rowIndex, editingType, inputModal } = this.props
        const column = this.getColumnInfo();
        this.form = form
        const dataIndex: string = column.dataIndex as string
        let inputType: JSX.Element = <Input />
        if (lodash.isFunction(column!.inputType)) {
            inputType = column!.inputType(record)
        }else if (column!.inputType) {
            inputType = column!.inputType as JSX.Element
        }

        const key = column!.dataIndex as string + ';' + rowIndex

        const extProps: any = {}
        if (inputModal === 'display' && !this.isEditing() && editingType === 'row') {
            extProps.disabled = true
        }

        return form.getFieldDecorator(key, {
            rules: column!.rules,
            initialValue: record[dataIndex],

        })(React.cloneElement(inputType, {
            ...extProps,
            ref: (input: Input) => {
                if (input.focus) {

                    if (inputModal === 'click' && editingType === 'cell') {
                        input.focus()
                    }
                }
            },
            getPopupContainer: (trigger: any) => trigger.parentNode.parentNode.parentNode.parentNode.parentNode,
            onBlur: () => {
                // 失去焦点的时候隐藏输入框
                if (editingType === 'cell') {
                    this.onCellSave('hide')
                }
            },

        }))
    }

    getClassName(): string {
        const { editingType, column, inputModal } = this.props
        const tdEditorClass = ' kotomi-components-table-editor-td'
        if (this.isEditing() && column !== undefined) {
            if (editingType === 'cell' && inputModal === 'click') {
                return 'kotomi-components-table-cell-value-wrap' + tdEditorClass
            }
            return tdEditorClass
        }
        return ''
    }

    isEditing() {
        const { /*column,*/ editing, isEditing } = this.props
        const { editing: stateEditing } = this.state

        /*
        if (column === undefined) {
            return false
        }
        */
        if (isEditing === false) {
            return false
        }

        if (editing) {
            return true
        }

        if (stateEditing === false) {
            return false
        }
        return true
    }

    clickEditCell = () => {
        const { editingType, column, currentEditorCell, rowIndex } = this.props
        const self = this
        const currentKey = column.dataIndex! + rowIndex
        const filterKey = currentEditorCell.filter((currentDataIndex) => {
            return currentDataIndex.props.column.dataIndex! + currentDataIndex.props.rowIndex === currentKey
        })
        if (
            // 如果数据没有点击过，则可以触发保存信息
            filterKey.length === 0 &&
            // 并且不是第一次点击
            currentEditorCell.length !== 0
        ) {
            if (editingType === 'cell') {
                currentEditorCell.forEach((cell) => {
                    cell.onCellSave('hide')
                })
                currentEditorCell.splice(0)
            }
        }
        if (editingType === 'cell') {
            currentEditorCell.push(self)
        }
        // 如果是表格编辑，则表示点击即可编辑
        if (editingType === 'cell') {
            self.setState({
                editing: true,
                ellipsis: false,
            })
        }
    }

    addBlank(tableContextProps: TableContextProps<T>) {
        tableContextProps.table!.blankDivElement.current!.style.visibility = 'visible'
    }

    renderDivCell(children: React.ReactNode, tableContextProps: TableContextProps<T>) {
        return (
            <Dropdown overlay={tableContextProps.dropdownMenu} trigger={['contextMenu']}>
                <div>
                    {children}
                </div>
            </Dropdown>
        )
    }

    renderCell = (tableContextProps: TableContextProps<T>) => {
        const { children, inputModal, column, editingType } = this.props

        const inputProps: any = {}
        if (column && column.inputWidth) {
            inputProps.width = column.inputWidth
        }

        this.form = tableContextProps.form!
        // 如果列允许编辑
        if (column !== undefined && column.isEditing) {
            // 如果是单元格编辑模式
            if (editingType === 'cell') {
                if (inputModal === 'click') {
                    // 如果为只读则不能进行编辑 或者没有dataIndex的列
                    if (!this.isEditing()) {
                        return this.renderDivCell(children, tableContextProps)
                    } else {
                        this.addBlank(tableContextProps)
                        return (
                            <>
                                <Form.Item
                                    style={inputProps}
                                >
                                    {this.renderFormItem(tableContextProps.form!)}
                                </Form.Item>
                            </>
                        )
                    }
                }

                if (inputModal === 'display') {
                    return (
                        <>
                            <Form.Item
                                style={inputProps}
                            >
                                {this.renderFormItem(tableContextProps.form!)}
                            </Form.Item>
                        </>
                    )
                }
            }
            // 如果是行编辑模式
            if (editingType === 'row') {
                if (inputModal === 'display') {
                    return (
                        <>
                            <Form.Item
                                key={new Date().getTime()}
                            >
                                {this.renderFormItem(tableContextProps.form!)}
                            </Form.Item>
                        </>
                    )
                }
                if (this.isEditing()) {
                    return (
                        <>
                            <Form.Item>
                                {this.renderFormItem(tableContextProps.form!)}
                            </Form.Item>
                        </>
                    )
                }
            }

        }
        return this.renderDivCell(children, tableContextProps)
    }

    render() {
        const { column, inputModal } = this.props
        const textAlign = column === undefined ? undefined : column.align
        const td = (
            <td
                className={this.props.className + " " + this.getClassName()}
                style={{
                    textAlign,
                }}
                onClick={() => {
                    if (column !== undefined && column.isEditing && inputModal === 'click') {
                        this.clickEditCell()
                    }
                }}
            >
                <TableContext.Consumer>
                    {this.renderCell}
                </TableContext.Consumer>
            </td>
        )
        if (this.state.ellipsis) {
            return this.props.onRenderTooltip(
                <Tooltip
                    overlayClassName='kotomi-components-table-cell-ellipsis'
                    title={this.props.record[this.props.column.dataIndex!]}
                    placement='bottomLeft'
                >
                    {td}
                </Tooltip>
            , this.props)
        }
        return td
    }
}
