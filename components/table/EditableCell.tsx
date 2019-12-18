import React from 'react'
import { Form } from 'antd'

import { ColumnProps } from './Table'
import { WrappedFormUtils } from "antd/lib/form/Form";


type Props<T> = {
    // 列的信息
    column?: ColumnProps<T>
    // 当前行的数据
    record?: T 
    // 当前行号
    rowIndex?: number
    // 当前单元格是否可编辑 true表示可编辑，false表示不可编辑
    editing?: boolean
    restProps?: any
}

export type EditableContextProps<T> = {
    form?: WrappedFormUtils
}

export const EditableContext = React.createContext({} as EditableContextProps<any>);

export class EditableCell<T> extends React.Component<Props<T>>{
    static defaultProps = {
        editing: false
    }

    renderFormItem=(form: WrappedFormUtils)=>{
        return form.getFieldDecorator(this.props.column!.dataIndex as string, {
            rules:this.props.column!.rules,
        })(this.props.column!.inputType)
    }

    renderCell = ({ form }: { form: WrappedFormUtils }) => {
        if(this.props.editing === false){
            return (
                <td {...this.props.restProps!}>
                    {this.props.children}
                </td>
            )
        }else{
            return (
                <td>
                    <Form.Item>
                        {this.renderFormItem(form)}
                    </Form.Item>
                </td>
            )
        }
    }

    render() {
        return (
            <EditableContext.Consumer>
                {this.renderCell}
            </EditableContext.Consumer>
        )
    }
}