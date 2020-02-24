import React,{useState} from 'react'

import { Form } from '../components/form/Form';
import { Input, Button,Form as AntForm } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';

export default { title: 'Form' };




class AntDesignForm extends React.Component<FormComponentProps> {
    render(){
        const { form } = this.props
        return (
            <AntForm>
                <AntForm.Item>
                    {form.getFieldDecorator('u1', {
                    })(
                        <Input
                        placeholder="u1"
                        />
                    )}
                </AntForm.Item>
                <AntForm.Item>
                    {form.getFieldDecorator('u2', {
                    })(
                        <Input
                        placeholder="u2"
                        />
                    )}
                </AntForm.Item>
                <AntForm.Item>
                    {form.getFieldDecorator('u3', {
                    })(
                        <Input
                        placeholder="u3"
                        />
                    )}
                </AntForm.Item>
            </AntForm>
        )
    }
}


const TempForm = AntForm.create({
    onValuesChange:(_props,changedValues,_allValues)=>{
        console.log(changedValues)
    }
})(AntDesignForm)

export const antDesignForm = ()=>{
    return <TempForm />
}

export const baseForm = () => {
    return (
        <Form
            script={`
                [name|Field1 drop 8-8-16]        [code|Field2 input 8-8-16 ]        [code1|Field3 input 8-8-16] 
                [name1|Field4 input 8-8-16]       [code2|Field5 input 16-2-22]
                [name2|Field6 input 16-2-22] [code3|Field7 input 8]
            `}
            rules={[{
                name:'name',
                rules:[{ required: true, message: '请输入用户名' }]
            }]}
            components={[{
                name: 'drop',
                component: <Input />
            }]}
            event={{
                onValuesChange:(changedValues: any, allValues: any)=>{
                    console.log(changedValues)
                    console.log(allValues)
                }
            }}
        />
    )
}

const form = React.createRef<any>()
export const stateForm = () => {
    const [prohibit, setProhibit] = useState(true)
    const [clickNumber, setClickNumber] = useState(0)
    return (
        <>
            <Button
                onClick={()=>{
                    setClickNumber(clickNumber+1)
                    setProhibit(!prohibit)
                    form.current!.validateFieldsPromise().then(({errors,values}:{errors: any,values: any})=>{
                        if(!errors){
                            console.log(values)
                        }
                    })
                }}
            >
                click number {clickNumber}
            </Button>
            <Form
                script={`
                    [name|Field4 drop 8-8-16]        [code|Field2 drop 8-8-16 ]        [code1|Field3 drop 8-8-16] 
                    [name1|Field4 drop 8-8-16]       [code2|Field5 drop 16-2-22]
                    [name2|Field6 drop 16-2-22] [code3|Field7 drop 8-8-16]
                `}
                refExt={form}
                /*
                rules={[{
                    name:'name',
                    rules:[{ required: true, message: '请输入用户名' }]
                }]}
                */
                components={[{
                    name: 'drop',
                    component: <Input  disabled={prohibit}/>
                }]}
                event={{
                    onValuesChange:(changedValues: any, allValues: any)=>{
                        console.log('----------------')
                        console.log('changedValues: ')
                        console.log(changedValues)
                        console.log('----------------')
                        console.log('allValues: ')
                        console.log(allValues)
                    }
                }}
            />
        </>
    )
}


export const testColForm = () => {
    return (
        <Form
            script={`
                [name    | Field0 input 8-8-16][name|Field1 input 8-2-16][name|Field2 input 8-8-16]
                [name1   | Field4 input 24-2.65-21.35]      
            `}
            rules={[{
                name:'name',
                rules:[{ required: true, message: '请输入用户名' }]
            }]}
            components={[{
                name: 'drop',
                component: <Input />
            }]}
            event={{
                onValuesChange:(changedValues: any, allValues: any)=>{
                    console.log(changedValues)
                    console.log(allValues)
                }
            }}
        />
    )
}
