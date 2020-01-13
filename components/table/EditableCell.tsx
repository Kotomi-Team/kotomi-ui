import React from 'react'
import { Form, Input } from 'antd'

import { ColumnProps } from './Table'
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
    restProps?: any
    // 显示模式，点击编辑，或者直接显示
    inputModal?: 'click' | 'display'
}

type State = {
    editing: boolean
}

export type EditableContextProps<T> = {
    form?: WrappedFormUtils
}

export const EditableContext = React.createContext({} as EditableContextProps<any>);

export class EditableCell<T> extends React.Component<Props<T>, State>{


    static defaultProps = {
        editing: false,
        // 单元格编辑模式，默认为
        editingType: 'cell',
        // 默认为点击编辑模式，这个模式只在行编辑模式下生效
        inputModal: 'click'
    }

    state = {
        editing: false
    }

    componentDidMount() {
        this.setState({
            editing: this.props.editing!
        })
    }

    renderFormItem = (form: WrappedFormUtils) => {
        const { column, onSave, record } = this.props
        const dataIndex: string = column.dataIndex as string
        const self = this
        const inputType: JSX.Element = column!.inputType || <Input />
        return form.getFieldDecorator(column!.dataIndex as string, {
            rules: column!.rules,
            initialValue: record[dataIndex],
        })(React.cloneElement(inputType, {
            // 用户移动鼠标后
            onBlur: () => {
                form.validateFields((err, values: T) => {
                    onSave({
                        ...record,
                        ...values
                    }, 'UPDATE').then((respState) => {
                        if (respState) {
                            self.setState({
                                editing: false
                            })
                        }
                    })
                })
            },
            ref: (input: Input) => {
                input.focus()
            }
        }))
    }

    getClassName(): string | undefined {
        const { editingType, column } = this.props
        const className = 'kotomi-components-table-cell-value-wrap'
        if (editingType === 'cell' && column !== undefined) {
            return className
        }
        return undefined
    }

    isEditing(): boolean {
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

    renderCell = ({ form }: { form: WrappedFormUtils }) => {
        const { editingType, restProps, children, inputModal } = this.props
        const self = this

        if (inputModal === 'click') {
            // 如果为只读则不能进行编辑 或者没有dataIndex的列
            if (!this.isEditing()) {
                return (
                    <div
                        {...restProps!}
                        className={this.getClassName()}
                        onClick={() => {
                            // 如果是表格编辑，则表示点击即可编辑
                            if (editingType === 'cell') {
                                self.setState({
                                    editing: true
                                })
                            }
                        }}
                    >
                        {children}
                    </div>
                )
            } else {
                return (
                    <>
                        <Form.Item>
                            {this.renderFormItem(form)}
                        </Form.Item>
                    </>
                )
            }
        }

        if (inputModal === 'display') {
            return (
                <>
                    <Form.Item>
                        {this.renderFormItem(form)}
                    </Form.Item>
                </>
            )
        }

        return (
            <div
                {...restProps!}
            >
                {children}
            </div>
        )
    }

    render() {
        return (
            <td>
                <EditableContext.Consumer>
                    {this.renderCell}
                </EditableContext.Consumer>
            </td>
        )
    }
}