import React from 'react'
import ReactDom from 'react-dom'
import { Form as AntForm, Row, Col, Input } from 'asp-antd-compatible'
import { WrappedFormUtils, ValidationRule, FormComponentProps } from 'antd/lib/form/Form';
import { ColProps } from 'antd/lib/grid/col';

export interface FormUtils<V = any> extends WrappedFormUtils<V>{
    /**
     * 通过Promise方式进行校验
     */
    validateFieldsPromise: () => Promise<{errors: any, values: V}>
}

type EditorComponent = {
    /**
     * 组件的唯一名称
     */
    name: string

    /**
     * 当前的组件实列
     */
    component: JSX.Element,
}

type Rule = {

    /**
     * 组件的唯一名称
     */
    name: string

    /**
     * 当前组件的校验规则
     */
    rules?: ValidationRule[],
}

type Props = {

    /**
     * 语义话脚本来进行布局
     *
     * ------------------------
     * 1. 表示当前列的名称
     * 2. 表示当前表单的输入类型
     * 3. 表示当前表单占用第几格
     *    - 如果不写第4个参数，则表示占用剩下的空间
     * ------------------------
     *
     * [name input]    [name input] [name input]
     * [name input]    [name input] [name input]
     */
    script: string
    form?: WrappedFormUtils

    // 全局默认的lael宽度
    labelCol?: ColProps
    onSubmit?: React.FormEventHandler<HTMLFormElement>
    wrapperCol?: ColProps
    // 当前表单的校验规则
    rules?: Rule[]

    // 表单的Row的间距，默认为24
    rowSpace: number

    // 当前表单的默认值
    initialValues?: any

    /**
     * 注册的组件信息,所有注册的组件都可以在语义化脚本中进行布局操作
     */
    components?: EditorComponent[]

    // 扩展的表格信息
    refExt?: Function | any

    style?: React.CSSProperties;

    /**
     * 表格数据改变后触发的事件。
     */
    onValuesChange?: (changedValues: any, allValues: any) => void,
}

type State = {
}

class FormItemProps {
    name?: string

    span?: number

    label?: string

    rules?: ValidationRule[]

    labelCol?: ColProps

    wrapperCol?: ColProps

    initialValue?: any

    component?: EditorComponent | undefined
}

/**
 * 可进行脚本语义化的form表单
 */
class Form extends React.Component<Props & FormComponentProps, State> {
    static defaultProps = {
        components: [],
        labelCol: {
            md: { span: 4 },
        },
        wrapperCol: {
            md: { span: 20 },
        },
        rowSpace: 24,
    }

    /**
     * 创建Form对象
     */
    public static create() {
        return AntForm.create<Props & FormComponentProps>({
            onValuesChange: (props, changedValues: any, allValues: any) => {
                if (props.onValuesChange) {
                    const { onValuesChange } = props
                    onValuesChange(changedValues, allValues)
                }
            },
        })(Form);
    }

    state = {
    }

    // 当前节点上拥有的组件
    components: EditorComponent[] = []

    rules: Rule[] = []

    constructor(props: Props & FormComponentProps) {
        super(props);
    }

    render() {
        const { labelCol, wrapperCol, onSubmit } = this.props
        return (
            <AntForm
                style={this.props.style}
                labelCol = {labelCol}
                wrapperCol= {wrapperCol}
                onSubmit= {onSubmit}
            >
                {
                    this.renderFormItems()
                }
            </AntForm>
        )
    }

    componentDidMount() {
        const { form } = this.props
        const proxyForm: any = form
        // fix https://github.com/Kotomi-Team/kotomi-ui/issues/45
        proxyForm.validateFieldsPromise = () => new Promise<{errors: any, values: any}>(resolve => {
                form.validateFields((errors, values) => {
                    resolve({
                        errors,
                        values,
                    })
                })
            })

        if (this.props.refExt) {
            if (this.props.refExt instanceof Function) {
                this.props.refExt(proxyForm as FormUtils)
            } else {
                const refExt = this.props.refExt as any
                refExt.current = proxyForm
            }
        }
    }

    // 解析生成form节点
    renderFormItems(): JSX.Element[] {
        const formItemsProps = this.getScriptToJsonArray()
        const formItems: JSX.Element[] = []
        const { form, labelCol, wrapperCol } = this.props
        formItemsProps.forEach((itemProps, index) => {
            const cols: JSX.Element[] = []
            itemProps.forEach(itemCol => {
                let rules: ValidationRule[] = []
                let initialValue
                if (itemCol.rules) {
                    rules = itemCol.rules
                }
                if (itemCol.initialValue) {
                    initialValue = itemCol.initialValue
                }

                if (itemCol.component) {
                    const colLabelCol = itemCol.labelCol || labelCol
                    const colWrapperCol = itemCol.wrapperCol || wrapperCol

                    const col: JSX.Element = (
                        <Col
                            span={Math.floor(itemCol.span!)}
                            key={ `form-item-col${itemCol.name}${index}`}
                            className="kotomi-components-form-col"
                        >
                             <AntForm.Item
                                key={ `form-item${itemCol.name}${index}`}
                                label={itemCol.label}
                                style={{
                                    marginBottom: this.props.rowSpace,
                                }}
                                labelCol = {{
                                    md: Math.floor(colLabelCol!.md as number),
                                }}
                                wrapperCol = {{
                                    md: Math.ceil(colWrapperCol!.md as number),
                                }}
                                ref={dom => {
                                    // eslint-disable-next-line react/no-find-dom-node
                                    const element = ReactDom.findDOMNode(dom) as Element
                                    if (element) {
                                        if (colLabelCol) {
                                             const labelElement: Element = element.getElementsByClassName(`ant-col-md-${Math.floor(colLabelCol.md as number)}`)[0]
                                             if (labelElement) {
                                                 labelElement.setAttribute('style', `width:${(colLabelCol.md as number / 24) * 100}%`)
                                             }
                                        }

                                        if (colWrapperCol) {
                                             const wrapperElement: Element = element.getElementsByClassName(`ant-col-md-${Math.ceil(colWrapperCol!.md as number)}`)[0]
                                             if (wrapperElement) {
                                                 wrapperElement.setAttribute('style', `width:${(colWrapperCol.md as number / 24) * 100}%`)
                                             }
                                        }
                                    }
                                 }}
                             >
                                {
                                    // @ts-ignore
                                    form.getFieldDecorator(itemCol.name, {
                                        rules,
                                        initialValue,
                                    })(itemCol.component.component)
                                }
                             </AntForm.Item>
                        </Col>
                    )
                    cols.push(col)
                } else {
                    // 如果默认找不到对应的组件，则抛出对应的错误信息
                    throw Error(`Unsupported component. field name [${itemCol.name}]`)
                }
            })
            formItems.push((
                <Row
                    key={`form-item-row${index}`}
                >
                    {cols}
                </Row>
            ))
        })
        return formItems
    }

    protected getPropsComponents() {
        const { components } = this.props
        return [
            ...components!,
            {
                name: 'input',
                component: <Input />,
            },
        ]
    }

    protected getRulesComponents() {
        const { rules } = this.props
        return [...(rules || [])]
    }

    /**
     * 将脚本信息，转换为json对象
     */
    protected getScriptToJsonArray(): FormItemProps[][] {
        const { script, initialValues } = this.props
        const components = this.getPropsComponents()
        const rules = this.getRulesComponents()
        try {
            const splitScript = script.trim().split('\n')
            const respArray: FormItemProps[][] = []

            splitScript.forEach(singleRowScript => {
                const matchs = singleRowScript.match(/\[.*?\]/g)
                const rowData: FormItemProps[] = []
                if (matchs) {
                    matchs.forEach(config => {
                        if (config) {
                            const realConfig = config
                            .replace(/\[/g, '')
                            .replace(/\]/g, '')
                            .split(/\s/g)
                            if (realConfig.length < 2) {
                                // 如果参数小于二个则直接跳过
                                return;
                            }
                            const fromItemProps = new FormItemProps()
                            if (realConfig[0].split('|').length >= 1) {
                                fromItemProps.name = realConfig[0].split('|')[0].trim()
                            }
                            if (realConfig[0].split('|').length >= 2) {
                                fromItemProps.label = realConfig[0].split('|')[1].trim()
                            } else {
                                fromItemProps.label = ''
                            }

                            // 添加组件
                            fromItemProps.component = components.filter(component => component.name.trim() === realConfig[1].trim())[0]

                             const rulesFilter = rules.filter(rule => rule.name === fromItemProps.name)

                            if (rulesFilter.length > 0) {
                                // 设置校验规则
                                fromItemProps.rules = rulesFilter[0].rules
                            }

                            // 设置默认值

                            // @ts-ignore
                            fromItemProps.initialValue = (initialValues || {})[fromItemProps.name]

                            // START 设置当前组件的span大小
                            if (realConfig[2] === undefined) {
                                let span = 24
                                rowData.forEach(colData => {
                                    span = -colData.span!
                                })
                                fromItemProps.span = span
                            } else {
                                const cols = realConfig[2].split('-')
                                fromItemProps.span = Number.parseInt(cols[0], 10)
                                if (cols[1]) {
                                    fromItemProps.labelCol = {
                                        md: Number.parseFloat(cols[1]),
                                    }
                                }
                                if (cols[2]) {
                                    fromItemProps.wrapperCol = {
                                        md: Number.parseFloat(cols[2]),
                                    }
                                }
                            }
                            // END
                            rowData.push(fromItemProps)
                        }
                    })
                }
                respArray.push(rowData)
            })
            return respArray
        } catch (error) {
            console.error(`KOTOMI-FORM-5001: Failed to parse script: \n${script}`)
            throw error
        }
    }
}

const ScriptForm = Form.create()

export { ScriptForm as Form };
