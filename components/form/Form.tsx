import React from 'react'
import { Form as AntForm, Row, Col, Input } from 'antd'
import { WrappedFormUtils, ValidationRule, FormComponentProps } from 'antd/lib/form/Form';
import { ColProps } from 'antd/lib/grid/col';

type EditorComponent = {

    /**
     * 组件的唯一名称
     */
    name: string

    /**
     * 当前的组件实列
     */
    component: JSX.Element
}

type Rule = {

    /**
     * 组件的唯一名称
     */
    name: string

    /**
     * 当前组件的校验规则
     */
    rules?: ValidationRule[] 
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
    labelCol?: ColProps
    onSubmit?: React.FormEventHandler<HTMLFormElement>
    wrapperCol?: ColProps
    key?: string 

    // 当前表单的校验规则
    rules?: Rule[]

    // 当前表单的默认值
    initialValues?: any

    /**
     * 注册的组件信息,所有注册的组件都可以在语义化脚本中进行布局操作
     */
    components?: EditorComponent[]

    event?: FormEvent

    // 扩展的表格信息
    refExt?: (form: WrappedFormUtils)=> void
}




type State = {
}


export type FormEvent= {
    /**
     * 表格数据改变后触发的事件。
     */
    onValuesChange?:(changedValues: any, allValues: any) => void
    
}
class FormItemProps {
    name: string
    span: number
    label: string
    rules?: ValidationRule[]
    labelCol?: ColProps
    wrapperCol?: ColProps
    initialValue?: any
    component: EditorComponent | undefined
}

/**
 * 可进行脚本语义化的form表单
 */
class Form extends React.Component<Props & FormComponentProps, State> {

    state = {
    }

    // 当前节点上拥有的组件
    components:EditorComponent[] = []
    rules: Rule[] = []

    static defaultProps = {
        components: [],
        labelCol: {
            md: { span: 4 }
        },
        wrapperCol: {
            md: { span: 20 }
        },
    }
    
    constructor(props: Props & FormComponentProps) {
        super(props);
    }

    componentDidMount(){
        const {refExt , form} = this.props
        if(refExt){
            refExt(form)
        }
    }

    /**
     * 创建Form对象
     */
    public static create(){
        return AntForm.create<Props & FormComponentProps>({
            onValuesChange:(props, changedValues: any, allValues: any)=>{
                if(props.event){
                    if(props.event.onValuesChange){
                        const { onValuesChange } = props.event
                        onValuesChange(changedValues, allValues)
                    }
                }
            }
        })(Form);
    }

    protected getPropsComponents(){
        const { components } = this.props
        return [
            ...components,
            {
                name: 'input',
                component: <Input />
            }
        ]
    }

    protected getRulesComponents(){
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
            
            splitScript.forEach((singleRowScript) => {
                const matchs = singleRowScript.match(/\[.*?\]/g)
                const rowData: FormItemProps[] = []
                if(matchs){
                    matchs.forEach((config)=>{
                        if (config) {
                            const realConfig = config.replace(/\[/g, '').replace(/\]/g, '').split(/\s/g)
                            if(realConfig.length < 2){
                                // 如果参数小于二个则直接跳过
                                return ;
                            }
    
                            const fromItemProps = new FormItemProps()
    
                            if(realConfig[0].split('|').length >= 1){
                                fromItemProps.name = realConfig[0].split('|')[0].trim()
                            }
                            if(realConfig[0].split('|').length >= 2){
                                fromItemProps.label =  realConfig[0].split('|')[1].trim()
                            }
                             
                            // 添加组件
                            fromItemProps.component = components.filter((component) => { 
                                return component.name.trim() === realConfig[1].trim()
                             })[0]
    
                             const rulesFilter = rules.filter(rule =>  {
                                return rule.name === fromItemProps.name 
                            })
                            
                            if(rulesFilter.length > 0){
                                // 设置校验规则
                                fromItemProps.rules = rulesFilter[0].rules
                            }
                            
                            // 设置默认值
                            fromItemProps.initialValue = (initialValues || {})[fromItemProps.name]
    
                            // START 设置当前组件的span大小
                            if (realConfig[2] === undefined) {
                                let span = 24
                                rowData.forEach((colData) => {
                                    span = - colData.span
                                })
                                fromItemProps.span = span
                            } else {
                                const cols = realConfig[2].split('-')
                                fromItemProps.span = Number.parseInt(cols[0])
                                if(cols[1]){
                                    fromItemProps.labelCol = {
                                        md: Number.parseInt(cols[1])
                                    }
                                }
                                if(cols[2]){
                                    fromItemProps.wrapperCol =  {
                                        md: Number.parseInt(cols[2])
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
            console.error("Failed to parse script: \n" + script)
            throw error
        }
    }

    // 解析生成form节点
    renderFormItems():JSX.Element[]  {
        const formItemsProps = this.getScriptToJsonArray()
        const formItems:JSX.Element[] = []
        const { form, labelCol, wrapperCol, key } = this.props
        formItemsProps.forEach((itemProps,index) => {
            const cols:JSX.Element[] = []
            itemProps.forEach((itemCol) => {
                let rules:ValidationRule[] = []
                let initialValue = undefined
                if(itemCol.rules){
                    rules = itemCol.rules
                }
                if(itemCol.initialValue){
                    initialValue=itemCol.initialValue
                }
    
                if(itemCol.component){

                    const colLabelCol =   itemCol.labelCol || labelCol
                    const colWrapperCol=  itemCol.wrapperCol || wrapperCol

                    const col:JSX.Element = (
                        <Col
                            span={itemCol.span}
                            key={ 'form-item-col' + itemCol.name + index}
                            className={`kotomi-components-form-${itemCol.name}${key === undefined ? '':`-${key}`}`}
                        >
                             <AntForm.Item
                                key={ 'form-item' + itemCol.name + index}
                                label={itemCol.label}
                                labelCol = {colLabelCol}
                                wrapperCol = {colWrapperCol}
                             >
                                {form.getFieldDecorator(itemCol.name, {
                                    rules,
                                    initialValue,
                                })(itemCol.component.component)}
                             </AntForm.Item>
                        </Col>
                    )
                    cols.push(col)
                }else{
                    // 如果默认找不到对应的组件，则抛出对应的错误信息
                    throw Error(`Unsupported component. field name [${itemCol.name}]`)
                }
            })
            formItems.push((
                <Row
                    key={'form-item-row' + index}
                >
                    {cols}
                </Row>
            ))
        })
        return formItems
    }


    render() {
        const {labelCol , wrapperCol, onSubmit} = this.props
        return (
            <AntForm
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
}

const ScriptForm = Form.create()

export { ScriptForm as Form };