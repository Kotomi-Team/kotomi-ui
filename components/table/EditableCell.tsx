import React from 'react'
import { Form, Input } from 'antd'

import { ColumnProps, TableContext, TableContextProps } from './Table'
import { WrappedFormUtils } from 'antd/lib/form/Form';


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
    // 显示模式，点击编辑，或者直接显示
    inputModal?: 'click' | 'display'
    // 当前正在编辑的cell
    currentEditorCell: EditableCell<T>[]
}

type State = {
    editing: boolean
}


export class EditableCell<T> extends React.Component<Props<T>, State>{

    static defaultProps = {
        editing: false,
        // 单元格编辑模式，默认为
        editingType: 'cell',
        // 默认为点击编辑模式，这个模式只在行编辑模式下生效
        inputModal: 'click'
    }

    private form: WrappedFormUtils

    state = {
        editing: false
    }

    componentDidMount() {
        this.setState({
            editing: this.props.editing!
        })
    }

    /**
     * 调用onSave的方法
     * @param isHideComponent hide 表示隐藏表格上的输入组件，none 表示不做任何操作
     */
    onCellSave(isHideComponent: 'hide' | 'none'):Promise<void> {
        return new Promise((resolve, _reject)=>{
            const self = this
            const { onSave, record, rowIndex } = this.props
            this.form.validateFields((err, values: any) => {
                if (!err) {
                    const newRecord: any = {
                        ...record
                    }
                    Object.keys(values).forEach((key) => {
                        const recordKey = key.split(';')
    
                        // 修复一列多个输入组件导致的BUG
                        if (Number.parseInt(recordKey[1]) === rowIndex) {
                            newRecord[recordKey[0]] = values[key]
                        }
                    })

                    if(JSON.stringify(record) !== JSON.stringify(newRecord)){
                        onSave({
                            ...newRecord
                        }, 'UPDATE').then((respState)=>{
                            resolve()
                        })
                    }
                    
                    // 如果隐藏组件，则隐藏
                    if (isHideComponent === 'hide') {
                        self.setState({
                            editing: false
                        })
                    }
                }
            })
            
        })
    }

    renderFormItem = (form: WrappedFormUtils) => {
        const { column, record, rowIndex, editingType } = this.props
        const self = this
        this.form = form
        const dataIndex: string = column.dataIndex as string
        const inputType: JSX.Element = column!.inputType || <Input />
        return form.getFieldDecorator(column!.dataIndex as string + ';' + rowIndex, {
            rules: column!.rules,
            initialValue: record[dataIndex],
        })(React.cloneElement(inputType, {
            ref: (input: Input) => {
                if (input.focus) {
                    if(column.inputModal === 'click'){
                        input.focus()
                    }
                }
            },
            onBlur: () => {
                if (editingType === 'cell') {
                    self.onCellSave('hide')
                }
            },
        }))
    }

    getClassName(): string | undefined {
        const { editingType, column, inputModal } = this.props
        const className = 'kotomi-components-table-cell-value-wrap'
        if (editingType === 'cell' && column !== undefined && inputModal ==='click') {
            return className
        }
        return undefined
    }

    isEditing() {
        const { column, editing } = this.props
        const { editing: stateEditing } = this.state
        if (column === undefined) {
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
    clickEditCell =()=>{
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
            if(editingType === 'cell'){
                currentEditorCell.forEach((cell) => {
                    cell.onCellSave('hide')
                })
                currentEditorCell.splice(0)
            }
        }
        if(editingType === 'cell'){
            currentEditorCell.push(self)
        }
        // 如果是表格编辑，则表示点击即可编辑
        if (editingType === 'cell') {
            self.setState({
                editing: true
            })
        }
    }
    renderCell = (tableContextProps: TableContextProps<T>) => {
        const {  children, inputModal, column } = this.props
        this.form = tableContextProps.form!
        const textAlign = column === undefined ?  undefined : column.align

        // 如果列允许编辑
        if (column !== undefined && column.isEditing) {
            if (inputModal === 'click') {
                // 如果为只读则不能进行编辑 或者没有dataIndex的列
                if (!this.isEditing()) {
                    return (
                        <div
                            style={{
                                textAlign
                            }}
                        >
                            {children}
                        </div>
                    )
                } else {
                    return (
                        <>
                            <Form.Item>
                                {this.renderFormItem(tableContextProps.form!)}
                            </Form.Item>
                        </>
                    )
                }
            }

            if (inputModal === 'display') {
                return (
                    <>
                        <Form.Item>
                            {this.renderFormItem(tableContextProps.form!)}
                        </Form.Item>
                    </>
                )
            }

        }
        // 否则返回空
        return (
            <div
                style={{
                    textAlign
                }}
            >
                {children}
            </div>
        )
    }

    render() {

        return (
            <td
                className={this.getClassName()}
                onClick={()=>{
                      const { inputModal, column } = this.props
                      if(column !== undefined && column.isEditing && inputModal === 'click'){
                        this.clickEditCell()
                      }
                }}
            >
                <TableContext.Consumer>
                    {this.renderCell}
                </TableContext.Consumer>
            </td>
        )
    }
}